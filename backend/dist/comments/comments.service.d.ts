import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';
export interface CreateCommentDto {
    postId: string;
    content: string;
}
export declare class CommentsService {
    private commentRepository;
    private postRepository;
    constructor(commentRepository: Repository<Comment>, postRepository: Repository<Post>);
    create(userId: string, dto: CreateCommentDto): Promise<Comment>;
    findByPost(postId: string): Promise<Comment[]>;
    remove(userId: string, id: string, isAdmin?: boolean): Promise<void>;
}
