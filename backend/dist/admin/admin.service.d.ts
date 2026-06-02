import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { File } from '../entities/file.entity';
import { Media } from '../entities/media.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
export interface UserStats {
    id: string;
    username: string;
    role: string;
    accentColor: string;
    fileCount: number;
    storageUsed: number;
    createdAt: Date;
    isLocked: boolean;
}
export interface SystemStats {
    totalUsers: number;
    totalFiles: number;
    totalMedia: number;
    totalStorage: number;
}
export declare class AdminService {
    private userRepository;
    private fileRepository;
    private mediaRepository;
    private refreshTokenRepository;
    constructor(userRepository: Repository<User>, fileRepository: Repository<File>, mediaRepository: Repository<Media>, refreshTokenRepository: Repository<RefreshToken>);
    getSystemStats(): Promise<SystemStats>;
    getAllUsers(): Promise<UserStats[]>;
    lockUser(userId: string): Promise<void>;
    unlockUser(userId: string): Promise<void>;
}
