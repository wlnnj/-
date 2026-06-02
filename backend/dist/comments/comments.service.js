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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../entities/comment.entity");
const post_entity_1 = require("../entities/post.entity");
let CommentsService = class CommentsService {
    constructor(commentRepository, postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }
    async create(userId, dto) {
        const post = await this.postRepository.findOne({ where: { id: dto.postId } });
        if (!post) {
            throw new common_1.NotFoundException('帖子不存在');
        }
        const comment = this.commentRepository.create({
            userId,
            postId: dto.postId,
            content: dto.content,
        });
        const savedComment = await this.commentRepository.save(comment);
        await this.postRepository.increment({ id: dto.postId }, 'commentCount', 1);
        return this.commentRepository.findOne({
            where: { id: savedComment.id },
            relations: ['user']
        });
    }
    async findByPost(postId) {
        return this.commentRepository.find({
            where: { postId },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }
    async remove(userId, id, isAdmin = false) {
        const comment = await this.commentRepository.findOne({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('评论不存在');
        }
        if (comment.userId !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('只能删除自己的评论');
        }
        await this.commentRepository.remove(comment);
        await this.postRepository.decrement({ id: comment.postId }, 'commentCount', 1);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map