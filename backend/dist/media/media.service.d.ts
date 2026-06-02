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
export declare class MediaService {
    private mediaRepository;
    constructor(mediaRepository: Repository<Media>);
    create(userId: string, dto: CreateMediaDto): Promise<Media>;
    findAllByUser(userId: string, type?: MediaType): Promise<Media[]>;
    findOne(userId: string, id: string): Promise<Media>;
    remove(userId: string, id: string): Promise<void>;
    getStats(userId: string): Promise<{
        images: number;
        videos: number;
        totalSize: number;
    }>;
}
