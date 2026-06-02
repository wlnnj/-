import { User } from './user.entity';
export declare class Post {
    id: string;
    userId: string;
    user: User;
    content: string;
    images: string[];
    commentCount: number;
    createdAt: Date;
}
