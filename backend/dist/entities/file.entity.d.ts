import { User } from './user.entity';
export declare class File {
    id: string;
    userId: string;
    user: User;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    qrToken: string;
    qrExpiresAt: Date;
    isPublic: boolean;
    createdAt: Date;
}
