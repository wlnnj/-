import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Memo } from '../entities/memo.entity';

export interface SearchResult {
    users: Array<{ id: string; username: string }>;
    posts: Array<{ id: string; content: string; userId: string; username: string; createdAt: Date }>;
    memos: Array<{ id: string; title: string; content: string; createdAt: Date }>;
}

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(Memo)
        private memoRepository: Repository<Memo>,
    ) { }

    async search(query: string, userId?: string): Promise<SearchResult> {
        const searchTerm = `%${query}%`;

        // 搜索用户
        const users = await this.userRepository.find({
            where: { username: Like(searchTerm) },
            select: ['id', 'username'],
            take: 10,
        });

        // 搜索帖子 (公开内容)
        const posts = await this.postRepository.find({
            where: { content: Like(searchTerm) },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: 20,
        });

        // 搜索备忘录 (仅自己的)
        let memos: Memo[] = [];
        if (userId) {
            memos = await this.memoRepository.find({
                where: [
                    { userId, title: Like(searchTerm) },
                    { userId, content: Like(searchTerm) },
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

    async searchUsers(query: string): Promise<Array<{ id: string; username: string }>> {
        const users = await this.userRepository.find({
            where: { username: Like(`%${query}%`) },
            select: ['id', 'username'],
            take: 20,
        });
        return users;
    }
}
