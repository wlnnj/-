"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const file_entity_1 = require("../entities/file.entity");
const uuid_1 = require("uuid");
const QRCode = __importStar(require("qrcode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
let FilesService = class FilesService {
    constructor(fileRepository, configService) {
        this.fileRepository = fileRepository;
        this.configService = configService;
        this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
        this.maxFileSize = this.configService.get('MAX_FILE_SIZE') || 1073741824;
        this.tempDir = path.join(this.uploadDir, 'temp');
        fs.ensureDirSync(this.uploadDir);
        fs.ensureDirSync(this.tempDir);
    }
    async saveChunk(identifier, index, buffer) {
        const chunkDir = path.join(this.tempDir, identifier);
        await fs.ensureDir(chunkDir);
        const chunkPath = path.join(chunkDir, `${index}`);
        await fs.writeFile(chunkPath, buffer);
    }
    async mergeChunks(userId, identifier, fileName, totalChunks, fileSize, mimeType) {
        const chunkDir = path.join(this.tempDir, identifier);
        if (!await fs.pathExists(chunkDir)) {
            throw new common_1.BadRequestException('找不到分片数据');
        }
        const ext = path.extname(fileName);
        const finalFileName = `${(0, uuid_1.v4)()}${ext}`;
        const finalFilePath = path.join(this.uploadDir, finalFileName);
        try {
            const writeStream = fs.createWriteStream(finalFilePath);
            for (let i = 0; i < totalChunks; i++) {
                const chunkPath = path.join(chunkDir, `${i}`);
                if (!await fs.pathExists(chunkPath)) {
                    throw new common_1.BadRequestException(`缺少分片: ${i}`);
                }
                const chunkData = await fs.readFile(chunkPath);
                writeStream.write(chunkData);
            }
            writeStream.end();
            await new Promise((resolve, reject) => {
                writeStream.on('finish', () => resolve(null));
                writeStream.on('error', reject);
            });
            await fs.remove(chunkDir);
            const file = this.fileRepository.create({
                userId,
                fileName,
                filePath: finalFileName,
                fileSize,
                mimeType,
            });
            return await this.fileRepository.save(file);
        }
        catch (error) {
            if (await fs.pathExists(finalFilePath)) {
                await fs.remove(finalFilePath);
            }
            throw error;
        }
    }
    async create(userId, dto) {
        if (dto.fileSize > this.maxFileSize) {
            throw new common_1.BadRequestException('文件大小超过限制 (最大 1GB)');
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
    async findAllByUser(userId, type, includePublic = false) {
        const query = this.fileRepository.createQueryBuilder('file');
        if (includePublic) {
            query.where('(file.userId = :userId OR file.isPublic = :isPublic)', { userId, isPublic: true });
        }
        else {
            query.where('file.userId = :userId', { userId })
                .andWhere('file.isPublic = :isPublic', { isPublic: false });
        }
        query.orderBy('file.createdAt', 'DESC');
        if (type === 'audio') {
            query.andWhere('file.mimeType LIKE :mime', { mime: 'audio/%' });
        }
        else if (type === 'image') {
            query.andWhere('file.mimeType LIKE :mime', { mime: 'image/%' });
        }
        else if (type === 'video') {
            query.andWhere('file.mimeType LIKE :mime', { mime: 'video/%' });
        }
        return query.getMany();
    }
    async scanSystemMusic(operatorId) {
        const musicDir = path.join(this.uploadDir, 'music');
        await fs.ensureDir(musicDir);
        const files = await fs.readdir(musicDir);
        for (const fileName of files) {
            const ext = path.extname(fileName).toLowerCase();
            let mimeType = 'application/octet-stream';
            if (['.mp3', '.wav', '.flac', '.m4a'].includes(ext)) {
                mimeType = 'audio/mpeg';
            }
            else if (ext === '.lrc') {
                mimeType = 'text/plain';
            }
            else {
                continue;
            }
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
                    filePath: `music/${fileName}`,
                    fileSize: stats.size,
                    mimeType: mimeType,
                    isPublic: true
                });
                await this.fileRepository.save(file);
                console.log(`已收录系统音乐: ${fileName}`);
            }
        }
    }
    async findOne(userId, id) {
        const file = await this.fileRepository.findOne({
            where: [
                { id, userId },
                { id, isPublic: true }
            ]
        });
        if (!file) {
            throw new common_1.NotFoundException('文件不存在');
        }
        return file;
    }
    async getFile(userId, id) {
        const file = await this.findOne(userId, id);
        const filePath = path.join(this.uploadDir, file.filePath);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('文件物理路径不存在');
        }
        return { file, filePath };
    }
    async remove(userId, id) {
        const file = await this.findOne(userId, id);
        const fullPath = path.join(this.uploadDir, file.filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
        await this.fileRepository.remove(file);
    }
    async generateQrCode(userId, id, baseUrl) {
        const file = await this.findOne(userId, id);
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        file.qrToken = token;
        file.qrExpiresAt = expiresAt;
        await this.fileRepository.save(file);
        const downloadUrl = `${baseUrl}/api/files/download/${token}`;
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
    async downloadByToken(token) {
        const file = await this.fileRepository.findOne({
            where: { qrToken: token },
        });
        if (!file) {
            throw new common_1.NotFoundException('下载链接无效');
        }
        if (file.qrExpiresAt && new Date() > file.qrExpiresAt) {
            throw new common_1.BadRequestException('下载链接已过期');
        }
        const filePath = path.join(this.uploadDir, file.filePath);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('文件不存在');
        }
        return { file, filePath };
    }
    async getStorageUsage(userId) {
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
        }
        catch (error) {
            console.error('清理临时文件失败:', error);
        }
    }
};
exports.FilesService = FilesService;
__decorate([
    (0, schedule_1.Cron)('0 3 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilesService.prototype, "cleanupTempFiles", null);
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_entity_1.File)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map