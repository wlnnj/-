import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { File } from '../entities/file.entity';
export interface FileUploadDto {
    fileName: string;
    fileSize: number;
    mimeType: string;
    filePath: string;
}
export declare class FilesService {
    private fileRepository;
    private configService;
    private uploadDir;
    private maxFileSize;
    private tempDir;
    constructor(fileRepository: Repository<File>, configService: ConfigService);
    saveChunk(identifier: string, index: number, buffer: Buffer): Promise<void>;
    mergeChunks(userId: string, identifier: string, fileName: string, totalChunks: number, fileSize: number, mimeType: string): Promise<File>;
    create(userId: string, dto: FileUploadDto): Promise<File>;
    findAllByUser(userId: string, type?: string, includePublic?: boolean): Promise<File[]>;
    scanSystemMusic(operatorId: string): Promise<void>;
    findOne(userId: string, id: string): Promise<File>;
    getFile(userId: string, id: string): Promise<{
        file: File;
        filePath: string;
    }>;
    remove(userId: string, id: string): Promise<void>;
    generateQrCode(userId: string, id: string, baseUrl: string): Promise<{
        qrCode: string;
        token: string;
        expiresAt: Date;
    }>;
    downloadByToken(token: string): Promise<{
        file: File;
        filePath: string;
    }>;
    getStorageUsage(userId: string): Promise<{
        totalSize: number;
        fileCount: number;
    }>;
    cleanupTempFiles(): Promise<void>;
}
