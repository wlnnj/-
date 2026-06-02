import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

export interface CreatePostDto {
    content: string;
    images?: string[];
}

export interface UpdatePostDto {
    content?: string;
    images?: string[];
}

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) { }

    async create(userId: string, dto: CreatePostDto): Promise<Post> {
        const post = this.postRepository.create({
            userId,
            content: dto.content,
            images: dto.images || [],
        });
        return this.postRepository.save(post);
    }

    // 帖子是全站公开的，所以不需要 userId 过滤
    async findAll(page: number = 1, limit: number = 20): Promise<{ posts: Post[]; total: number }> {
        const [posts, total] = await this.postRepository.findAndCount({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { posts, total };
    }

    async findOne(id: string): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!post) {
            throw new NotFoundException('帖子不存在');
        }
        return post;
    }

    async update(userId: string, id: string, dto: UpdatePostDto): Promise<Post> {
        const post = await this.findOne(id);
        if (post.userId !== userId) {
            throw new ForbiddenException('只能编辑自己的帖子');
        }
        Object.assign(post, dto);
        return this.postRepository.save(post);
    }

    async remove(userId: string, id: string, isAdmin: boolean = false): Promise<void> {
        const post = await this.findOne(id);
        if (post.userId !== userId && !isAdmin) {
            throw new ForbiddenException('只能删除自己的帖子');
        }
        await this.postRepository.remove(post);
    }

    async incrementCommentCount(id: string): Promise<void> {
        await this.postRepository.increment({ id }, 'commentCount', 1);
    }
}
