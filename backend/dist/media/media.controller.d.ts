import { MediaService } from './media.service';
import { Media } from '../entities/media.entity';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    upload(req: any, file: Express.Multer.File): Promise<Media>;
    findAll(req: any, type?: string): Promise<Media[]>;
    getStats(req: any): Promise<{
        images: number;
        videos: number;
        totalSize: number;
    }>;
    findOne(req: any, id: string): Promise<Media>;
    remove(req: any, id: string): Promise<void>;
}
