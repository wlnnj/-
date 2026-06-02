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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const post_entity_1 = require("../entities/post.entity");
const memo_entity_1 = require("../entities/memo.entity");
let SearchService = class SearchService {
    constructor(userRepository, postRepository, memoRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.memoRepository = memoRepository;
    }
    async search(query, userId) {
        const searchTerm = `%${query}%`;
        const users = await this.userRepository.find({
            where: { username: (0, typeorm_2.Like)(searchTerm) },
            select: ['id', 'username'],
            take: 10,
        });
        const posts = await this.postRepository.find({
            where: { content: (0, typeorm_2.Like)(searchTerm) },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: 20,
        });
        let memos = [];
        if (userId) {
            memos = await this.memoRepository.find({
                where: [
                    { userId, title: (0, typeorm_2.Like)(searchTerm) },
                    { userId, content: (0, typeorm_2.Like)(searchTerm) },
                ],
                order: { createdAt: 'DESC' },
                take: 10,
            });
        }
        return {
            users: users.map(u => ({ id: u.id, username: u.username })),
            posts: posts.map(p => ({
                id: p.id,
                content: p.content.substring(0, 100) + (p.content.length > 100 ? '...' : ''),
                userId: p.userId,
                username: p.user?.username || 'Unknown',
                createdAt: p.createdAt,
            })),
            memos: memos.map(m => ({
                id: m.id,
                title: m.title || '无标题',
                content: m.content?.substring(0, 100) + (m.content?.length > 100 ? '...' : '') || '',
                createdAt: m.createdAt,
            })),
        };
    }
    async searchUsers(query) {
        const users = await this.userRepository.find({
            where: { username: (0, typeorm_2.Like)(`%${query}%`) },
            select: ['id', 'username'],
            take: 20,
        });
        return users;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(2, (0, typeorm_1.InjectRepository)(memo_entity_1.Memo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map