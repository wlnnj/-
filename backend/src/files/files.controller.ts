import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Request,
    Body,
    Res,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FilesService } from './files.service';
import { File } from '../entities/file.entity';
import { Public } from '../auth/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

import { JwtService } from '@nestjs/jwt';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly jwtService: JwtService
    ) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    // Start of filename must be random to avoid conflicts
                    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
            limits: {
                fileSize: 1073741824, // 1GB
            },
        }),
    )
    async upload(
        @Request() req: any,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<File> {
        if (!file) {
            throw new BadRequestException('请选择要上传的文件');
        }

        return this.filesService.create(req.user.id, {
            fileName: file.originalname,
            filePath: file.filename, // This is the filename saved on disk
            fileSize: file.size,
            mimeType: file.originalname.endsWith('.lrc') ? 'text/plain' : file.mimetype,
        });
    }

    @Post('upload/chunk')
    @UseInterceptors(FileInterceptor('chunk'))
    async uploadChunk(
        @Request() req: any,
        @UploadedFile() chunk: Express.Multer.File,
        @Body('identifier') identifier: string,
        @Body('index') index: number,
    ) {
        if (!chunk || !identifier || index === undefined) {
            throw new BadRequestException('Invalid chunk data: missing chunk, identifier or index');
        }
        return this.filesService.saveChunk(identifier, parseInt(index.toString()), chunk.buffer);
    }

    @Post('upload/merge')
    async mergeChunks(
        @Request() req: any,
        @Body('identifier') identifier: string,
        @Body('fileName') fileName: string,
        @Body('totalChunks') totalChunks: number,
        @Body('fileSize') fileSize: number,
        @Body('mimeType') mimeType: string,
    ): Promise<File> {
        if (!identifier || !fileName || !totalChunks) {
            throw new BadRequestException('Invalid merge data');
        }
        return this.filesService.mergeChunks(req.user.id, identifier, fileName, parseInt(totalChunks.toString()), fileSize, mimeType);
    }

    @Post('music/scan')
    async scanMusic(@Request() req: any): Promise<void> {
        // Ideally restrict to admin, but for now open to authenticated users
        return this.filesService.scanSystemMusic(req.user.id);
    }

    @Get()
    findAll(
        @Request() req: any,
        @Query('type') type?: string,
        @Query('includePublic') includePublic?: string
    ): Promise<File[]> {
        const isPublic = includePublic === 'true';
        return this.filesService.findAllByUser(req.user.id, type, isPublic);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string): Promise<File> {
        return this.filesService.findOne(req.user.id, id);
    }

    @Delete(':id')
    async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
        return this.filesService.remove(req.user.id, id);
    }

    @Public()
    @SkipThrottle()
    @Get(':id/content')
    async getContent(
        @Request() req: any,
        @Param('id') id: string,
        @Query('token') token: string,
        @Res() res: Response,
    ): Promise<void> {
        let userId: string;

        // Try to get user from request (if header auth worked)
        if (req.user) {
            userId = req.user.id;
        } else if (token) {
            // Manual verification for query param auth (media streaming)
            try {
                const payload = this.jwtService.verify(token);
                userId = payload.sub;
            } catch (e) {
                throw new BadRequestException('无效的访问令牌');
            }
        } else {
            throw new BadRequestException('未授权访问');
        }

        const { file, filePath } = await this.filesService.getFile(userId, id);

        // 安全防护：阻止危险 MIME 类型内联执行
        const dangerousMimes = [
            'text/html', 'application/xhtml+xml',
            'text/javascript', 'application/javascript',
            'text/xml', 'application/xml',
            'image/svg+xml', // SVG 可以包含脚本
        ];

        // Force utf-8 for lyrics files to prevent garbled text
        if (file.fileName.endsWith('.lrc') || file.mimeType === 'text/plain') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        } else {
            res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        }

        const isSafe = !dangerousMimes.includes(file.mimeType?.toLowerCase() || '');

        if (isSafe) {
            // res.setHeader('Content-Type' set above already)
            res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.fileName)}"`);
        } else {
            // 强制下载，不执行
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.fileName)}"`);
        }

        // 防止 MIME 嗅探
        res.setHeader('X-Content-Type-Options', 'nosniff');

        const absolutePath = path.resolve(filePath);
        res.sendFile(absolutePath);
    }

    @Post(':id/qrcode')
    async generateQrCode(
        @Request() req: any,
        @Param('id') id: string,
    ): Promise<{ qrCode: string; token: string; expiresAt: Date }> {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return this.filesService.generateQrCode(req.user.id, id, baseUrl);
    }

    @Public()
    @Get('download/:token')
    async downloadByToken(
        @Param('token') token: string,
        @Query('mode') mode: string,
        @Res() res: Response,
    ): Promise<void> {
        const { file, filePath } = await this.filesService.downloadByToken(token);

        // 安全防护：阻止危险 MIME 类型内联执行
        const dangerousMimes = [
            'text/html', 'application/xhtml+xml',
            'text/javascript', 'application/javascript',
            'text/xml', 'application/xml',
            'image/svg+xml',
        ];

        const isDangerous = dangerousMimes.includes(file.mimeType?.toLowerCase() || '');

        if (isDangerous || mode !== 'preview') {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.fileName)}"`);
        } else {
            res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.fileName)}"`);
        }

        res.setHeader('X-Content-Type-Options', 'nosniff');

        const absolutePath = path.resolve(filePath);
        res.sendFile(absolutePath);
    }

    @Get('storage/usage')
    async getStorageUsage(@Request() req: any): Promise<{ totalSize: number; fileCount: number }> {
        return this.filesService.getStorageUsage(req.user.id);
    }
}
