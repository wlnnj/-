import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';

export interface CreateCommentDto {
    postId: string;
    content: string;
}

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) { }

    async create(userId: string, dto: CreateCommentDto): Promise<Comment> {
        // 检查帖子是否存在
        const post = await this.postRepository.findOne({ where: { id: dto.postId } });
        if (!post) {
            throw new NotFoundException('帖子不存在');
        }

        const comment = this.commentRepository.create({
            userId,
            postId: dto.postId,
            content: dto.content,
        });

        const savedComment = await this.commentRepository.save(comment);

        // 增加帖子评论计数
        await this.postRepository.increment({ id: dto.postId }, 'commentCount', 1);

        // 返回包含用户信息的完整评论
        return this.commentRepository.findOne({
            where: { id: savedComment.id },
            relations: ['user']
        }) as Promise<Comment>;
    }

    async findByPost(postId: string): Promise<Comment[]> {
        return this.commentRepository.find({
            where: { postId },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }

    async remove(userId: string, id: string, isAdmin: boolean = false): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id },
        });

        if (!comment) {
            throw new NotFoundException('评论不存在');
        }

        if (comment.userId !== userId && !isAdmin) {
            throw new ForbiddenException('只能删除自己的评论');
        }

        await this.commentRepository.remove(comment);

        // 减少帖子评论计数
        await this.postRepository.decrement({ id: comment.postId }, 'commentCount', 1);
    }
}
