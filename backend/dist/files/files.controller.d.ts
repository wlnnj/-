import { Response } from 'express';
import { FilesService } from './files.service';
import { File } from '../entities/file.entity';
import { JwtService } from '@nestjs/jwt';
export declare class FilesController {
    private readonly filesService;
    private readonly jwtService;
    constructor(filesService: FilesService, jwtService: JwtService);
    upload(req: any, file: Express.Multer.File): Promise<File>;
    uploadChunk(req: any, chunk: Express.Multer.File, identifier: string, index: number): Promise<void>;
    mergeChunks(req: any, identifier: string, fileName: string, totalChunks: number, fileSize: number, mimeType: string): Promise<File>;
    scanMusic(req: any): Promise<void>;
    findAll(req: any, type?: string, includePublic?: string): Promise<File[]>;
    findOne(req: any, id: string): Promise<File>;
    remove(req: any, id: string): Promise<void>;
    getContent(req: any, id: string, token: string, res: Response): Promise<void>;
    generateQrCode(req: any, id: string): Promise<{
        qrCode: string;
        token: string;
        expiresAt: Date;
    }>;
    downloadByToken(token: string, mode: string, res: Response): Promise<void>;
    getStorageUsage(req: any): Promise<{
        totalSize: number;
        fileCount: number;
    }>;
}
