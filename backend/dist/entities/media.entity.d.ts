import { User } from './user.entity';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare class Media {
    id: string;
    userId: string;
    user: User;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    type: MediaType;
    thumbnailPath: string;
    width: number;
    height: number;
    duration: number;
    createdAt: Date;
}
