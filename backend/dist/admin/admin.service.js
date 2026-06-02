"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const file_entity_1 = require("../entities/file.entity");
const media_entity_1 = require("../entities/media.entity");
const refresh_token_entity_1 = require("../entities/refresh-token.entity");
let AdminService = class AdminService {
    constructor(userRepository, fileRepository, mediaRepository, refreshTokenRepository) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.mediaRepository = mediaRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    async getSystemStats() {
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
        const totalStorage = (parseInt(fileStorageResult?.total) || 0) +
            (parseInt(mediaStorageResult?.total) || 0);
        return {
            totalUsers,
            totalFiles,
            totalMedia,
            totalStorage,
        };
    }
    async getAllUsers() {
        const users = await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
        const userStats = [];
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
    async lockUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        user.isLocked = true;
        await this.userRepository.save(user);
        await this.refreshTokenRepository.update({ userId, isRevoked: false }, { isRevoked: true });
    }
    async unlockUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        user.isLocked = false;
        await this.userRepository.save(user);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(file_entity_1.File)),
    __param(2, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __param(3, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map