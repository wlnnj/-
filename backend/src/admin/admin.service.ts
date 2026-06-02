import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(File)
        private fileRepository: Repository<File>,
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) { }

    async getSystemStats(): Promise<SystemStats> {
        const totalUsers = await this.userRepository.count();
        const totalFiles = await this.fileRepository.count();
        const totalMedia = await this.mediaRepository.count();

        const fileStorageResult = await this.fileRepository
            .createQueryBuilder('file')
            .select('SUM(file.fileSize)', 'total')
            .getRawOne();

        const mediaStorageResult = await this.mediaRepository
            .createQueryBuilder('media')
            .select('SUM(media.fileSize)', 'total')
            .getRawOne();

        const totalStorage =
            (parseInt(fileStorageResult?.total) || 0) +
            (parseInt(mediaStorageResult?.total) || 0);

        return {
            totalUsers,
            totalFiles,
            totalMedia,
            totalStorage,
        };
    }

    async getAllUsers(): Promise<UserStats[]> {
        const users = await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });

        const userStats: UserStats[] = [];
        for (const user of users) {
            const fileStats = await this.fileRepository
                .createQueryBuilder('file')
                .select('COUNT(*)', 'count')
                .addSelect('COALESCE(SUM(file.fileSize), 0)', 'size')
                .where('file.userId = :userId', { userId: user.id })
                .getRawOne();

            userStats.push({
                id: user.id,
                username: user.username,
                role: user.role,
                accentColor: user.accentColor,
                fileCount: parseInt(fileStats?.count) || 0,
                storageUsed: parseInt(fileStats?.size) || 0,
                createdAt: user.createdAt,
                isLocked: user.isLocked,
            });
        }
        return userStats;
    }

    async lockUser(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('用户不存在');
        }
        user.isLocked = true;
        await this.userRepository.save(user);

        // 撤销该用户的所有 refresh tokens，强制立即下线
        await this.refreshTokenRepository.update(
            { userId, isRevoked: false },
            { isRevoked: true }
        );
    }

    async unlockUser(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('用户不存在');
        }
        user.isLocked = false;
        await this.userRepository.save(user);
    }
}
