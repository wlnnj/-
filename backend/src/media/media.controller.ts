import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    Request,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { MediaService } from './media.service';
import { Media, MediaType } from '../entities/media.entity';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/media',
                filename: (req, file, cb) => {
                    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('只支持图片和视频文件'), false);
                }
            },
            limits: {
                fileSize: 1073741824, // 1GB
            },
        }),
    )
    async upload(
        @Request() req: any,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Media> {
        if (!file) {
            throw new BadRequestException('请选择要上传的文件');
        }

        const type = file.mimetype.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO;

        return this.mediaService.create(req.user.id, {
            fileName: file.originalname,
            filePath: `media/${file.filename}`,
            fileSize: file.size,
            mimeType: file.mimetype,
            type,
        });
    }

    @Get()
    findAll(
        @Request() req: any,
        @Query('type') type?: string,
    ): Promise<Media[]> {
        const mediaType = type === 'image' ? MediaType.IMAGE : type === 'video' ? MediaType.VIDEO : undefined;
        return this.mediaService.findAllByUser(req.user.id, mediaType);
    }

    @Get('stats')
    getStats(@Request() req: any): Promise<{ images: number; videos: number; totalSize: number }> {
        return this.mediaService.getStats(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string): Promise<Media> {
        return this.mediaService.findOne(req.user.id, id);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string): Promise<void> {
        return this.mediaService.remove(req.user.id, id);
    }
}
