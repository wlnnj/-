import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from '../entities/media.entity';

export interface CreateMediaDto {
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    type: MediaType;
    thumbnailPath?: string;
    width?: number;
    height?: number;
    duration?: number;
}

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
    ) { }

    async create(userId: string, dto: CreateMediaDto): Promise<Media> {
        const media = this.mediaRepository.create({
            userId,
            ...dto,
        });
        return this.mediaRepository.save(media);
    }

    async findAllByUser(userId: string, type?: MediaType): Promise<Media[]> {
        const query: any = { userId };
        if (type) {
            query.type = type;
        }
        return this.mediaRepository.find({
            where: query,
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(userId: string, id: string): Promise<Media> {
        const media = await this.mediaRepository.findOne({
            where: { id, userId },
        });
        if (!media) {
            throw new NotFoundException('媒体不存在');
        }
        return media;
    }

    async remove(userId: string, id: string): Promise<void> {
        const media = await this.findOne(userId, id);
        await this.mediaRepository.remove(media);
    }

    // 获取媒体统计
    async getStats(userId: string): Promise<{ images: number; videos: number; totalSize: number }> {
        const result = await this.mediaRepository
            .createQueryBuilder('media')
            .select('media.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(media.fileSize)', 'size')
            .where('media.userId = :userId', { userId })
            .groupBy('media.type')
            .getRawMany();

        const stats = { images: 0, videos: 0, totalSize: 0 };
        result.forEach((row) => {
            if (row.type === MediaType.IMAGE) {
                stats.images = parseInt(row.count);
            } else if (row.type === MediaType.VIDEO) {
                stats.videos = parseInt(row.count);
            }
            stats.totalSize += parseInt(row.size) || 0;
        });
        return stats;
    }
}
