import { User } from './user.entity';
import { Post } from './post.entity';
export declare class Comment {
    id: string;
    postId: string;
    post: Post;
    userId: string;
    user: User;
    content: string;
    createdAt: Date;
}
