import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { File } from '../entities/file.entity';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs-extra';

export interface FileUploadDto {
    fileName: string;
    fileSize: number;
    mimeType: string;
    filePath: string;
}

@Injectable()
export class FilesService {
    private uploadDir: string;
    private maxFileSize: number;
    private tempDir: string;

    constructor(
        @InjectRepository(File)
        private fileRepository: Repository<File>,
        private configService: ConfigService,
    ) {
        this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
        this.maxFileSize = this.configService.get('MAX_FILE_SIZE') || 1073741824; // 1GB
        this.tempDir = path.join(this.uploadDir, 'temp');

        // 确保上传目录和临时目录存在
        fs.ensureDirSync(this.uploadDir);
        fs.ensureDirSync(this.tempDir);
    }

    // 保存分片
    async saveChunk(identifier: string, index: number, buffer: Buffer): Promise<void> {
        const chunkDir = path.join(this.tempDir, identifier);
        await fs.ensureDir(chunkDir);
        const chunkPath = path.join(chunkDir, `${index}`);
        await fs.writeFile(chunkPath, buffer);
    }

    // 合并分片
    async mergeChunks(userId: string, identifier: string, fileName: string, totalChunks: number, fileSize: number, mimeType: string): Promise<File> {
        const chunkDir = path.join(this.tempDir, identifier);
        if (!await fs.pathExists(chunkDir)) {
            throw new BadRequestException('找不到分片数据');
        }

        const ext = path.extname(fileName);
        const finalFileName = `${uuidv4()}${ext}`;
        const finalFilePath = path.join(this.uploadDir, finalFileName);

        try {
            // 创建写入流
            const writeStream = fs.createWriteStream(finalFilePath);

            // 按顺序合并所有分片
            for (let i = 0; i < totalChunks; i++) {
                const chunkPath = path.join(chunkDir, `${i}`);
                if (!await fs.pathExists(chunkPath)) {
                    throw new BadRequestException(`缺少分片: ${i}`);
                }
                const chunkData = await fs.readFile(chunkPath);
                writeStream.write(chunkData);
            }

            writeStream.end();

            await new Promise((resolve, reject) => {
                writeStream.on('finish', () => resolve(null));
                writeStream.on('error', reject);
            });

            // 清理临时分片
            await fs.remove(chunkDir);

            // 保存到数据库
            const file = this.fileRepository.create({
                userId,
                fileName,
                filePath: finalFileName,
                fileSize,
                mimeType,
            });
            return await this.fileRepository.save(file);
        } catch (error) {
            // 清理失败的文件
            if (await fs.pathExists(finalFilePath)) {
                await fs.remove(finalFilePath);
            }
            throw error;
        }
    }

    async create(userId: string, dto: FileUploadDto): Promise<File> {
        if (dto.fileSize > this.maxFileSize) {
            throw new BadRequestException('文件大小超过限制 (最大 1GB)');
        }

        const file = this.fileRepository.create({
            userId,
            fileName: dto.fileName,
            filePath: dto.filePath,
            fileSize: dto.fileSize,
            mimeType: dto.mimeType,
        });
        return this.fileRepository.save(file);
    }

    async findAllByUser(userId: string, type?: string, includePublic: boolean = false): Promise<File[]> {
        const query = this.fileRepository.createQueryBuilder('file');

        if (includePublic) {
            // Music Player Mode: Show public files + user's files
            query.where('(file.userId = :userId OR file.isPublic = :isPublic)', { userId, isPublic: true });
        } else {
            // Drive Mode: Show ONLY user's PRIVATE files
            // This hides the system music even for the admin who owns them
            query.where('file.userId = :userId', { userId })
                .andWhere('file.isPublic = :isPublic', { isPublic: false });
        }

        query.orderBy('file.createdAt', 'DESC');

        if (type === 'audio') {
            query.andWhere('file.mimeType LIKE :mime', { mime: 'audio/%' });
        } else if (type === 'image') {
            query.andWhere('file.mimeType LIKE :mime', { mime: 'image/%' });
        } else if (type === 'video') {
            query.andWhere('file.mimeType LIKE :mime', { mime: 'video/%' });
        }

        return query.getMany();
    }

    // 扫描系统音乐文件夹
    async scanSystemMusic(operatorId: string): Promise<void> {
        const musicDir = path.join(this.uploadDir, 'music');
        await fs.ensureDir(musicDir);

        const files = await fs.readdir(musicDir);

        for (const fileName of files) {
            const ext = path.extname(fileName).toLowerCase();
            let mimeType = 'application/octet-stream';

            if (['.mp3', '.wav', '.flac', '.m4a'].includes(ext)) {
                mimeType = 'audio/mpeg'; // Simplified
            } else if (ext === '.lrc') {
                mimeType = 'text/plain';
            } else {
                continue; // Skip unknown files for now
            }

            // Check if exists
            const existing = await this.fileRepository.findOne({
                where: {
                    fileName: fileName,
                    isPublic: true
                }
            });

            if (!existing) {
                const stats = await fs.stat(path.join(musicDir, fileName));

                const file = this.fileRepository.create({
                    userId: operatorId,
                    fileName: fileName,
                    filePath: `music/${fileName}`, // Relative to uploadDir
                    fileSize: stats.size,
                    mimeType: mimeType,
                    isPublic: true
                });
                await this.fileRepository.save(file);
                console.log(`已收录系统音乐: ${fileName}`);
            }
        }
    }

    async findOne(userId: string, id: string): Promise<File> {
        const file = await this.fileRepository.findOne({
            where: [
                { id, userId },
                { id, isPublic: true }
            ]
        });
        if (!file) {
            throw new NotFoundException('文件不存在');
        }
        return file;
    }

    async getFile(userId: string, id: string): Promise<{ file: File; filePath: string }> {
        const file = await this.findOne(userId, id);
        const filePath = path.join(this.uploadDir, file.filePath);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('文件物理路径不存在');
        }
        return { file, filePath };
    }

    async remove(userId: string, id: string): Promise<void> {
        const file = await this.findOne(userId, id);

        // 删除物理文件
        const fullPath = path.join(this.uploadDir, file.filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        await this.fileRepository.remove(file);
    }

    // 生成下载二维码
    async generateQrCode(userId: string, id: string, baseUrl: string): Promise<{ qrCode: string; token: string; expiresAt: Date }> {
        const file = await this.findOne(userId, id);

        // 生成唯一令牌
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24小时后过期

        // 保存令牌
        file.qrToken = token;
        file.qrExpiresAt = expiresAt;
        await this.fileRepository.save(file);

        // 生成下载链接
        const downloadUrl = `${baseUrl}/api/files/download/${token}`;

        // 生成二维码
        const qrCode = await QRCode.toDataURL(downloadUrl, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });

        return { qrCode, token, expiresAt };
    }

    // 通过令牌下载文件
    async downloadByToken(token: string): Promise<{ file: File; filePath: string }> {
        const file = await this.fileRepository.findOne({
            where: { qrToken: token },
        });

        if (!file) {
            throw new NotFoundException('下载链接无效');
        }

        if (file.qrExpiresAt && new Date() > file.qrExpiresAt) {
            throw new BadRequestException('下载链接已过期');
        }

        const filePath = path.join(this.uploadDir, file.filePath);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('文件不存在');
        }

        return { file, filePath };
    }

    // 获取用户存储使用情况 (管理员功能)
    async getStorageUsage(userId: string): Promise<{ totalSize: number; fileCount: number }> {
        const result = await this.fileRepository
            .createQueryBuilder('file')
            .select('SUM(file.fileSize)', 'totalSize')
            .addSelect('COUNT(*)', 'fileCount')
            .where('file.userId = :userId', { userId })
            .getRawOne();

        return {
            totalSize: parseInt(result.totalSize) || 0,
            fileCount: parseInt(result.fileCount) || 0,
        };
    }

    // 每天凌晨 3 点清理临时文件
    @Cron('0 3 * * *')
    async cleanupTempFiles() {
        try {
            const files = await fs.readdir(this.tempDir);
            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            for (const file of files) {
                const filePath = path.join(this.tempDir, file);
                const stats = await fs.stat(filePath);

                if (now - stats.mtimeMs > ONE_DAY) {
                    await fs.remove(filePath);
                    console.log(`已清理临时文件: ${filePath}`);
                }
            }
        } catch (error) {
            console.error('清理临时文件失败:', error);
        }
    }
}

