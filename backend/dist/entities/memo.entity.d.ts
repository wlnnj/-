import { User } from './user.entity';
export declare class Memo {
    id: string;
    userId: string;
    user: User;
    title: string;
    content: string;
    isMarkdown: boolean;
    createdAt: Date;
    updatedAt: Date;
}
