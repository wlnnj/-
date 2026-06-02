import { CommentsService, CreateCommentDto } from './comments.service';
import { Comment } from '../entities/comment.entity';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    create(req: any, dto: CreateCommentDto): Promise<Comment>;
    findByPost(postId: string): Promise<Comment[]>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
