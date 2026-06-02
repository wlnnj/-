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
export declare class PostsService {
    private postRepository;
    constructor(postRepository: Repository<Post>);
    create(userId: string, dto: CreatePostDto): Promise<Post>;
    findAll(page?: number, limit?: number): Promise<{
        posts: Post[];
        total: number;
    }>;
    findOne(id: string): Promise<Post>;
    update(userId: string, id: string, dto: UpdatePostDto): Promise<Post>;
    remove(userId: string, id: string, isAdmin?: boolean): Promise<void>;
    incrementCommentCount(id: string): Promise<void>;
}
