import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Memo } from '../entities/memo.entity';
export interface SearchResult {
    users: Array<{
        id: string;
        username: string;
    }>;
    posts: Array<{
        id: string;
        content: string;
        userId: string;
        username: string;
        createdAt: Date;
    }>;
    memos: Array<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
    }>;
}
export declare class SearchService {
    private userRepository;
    private postRepository;
    private memoRepository;
    constructor(userRepository: Repository<User>, postRepository: Repository<Post>, memoRepository: Repository<Memo>);
    search(query: string, userId?: string): Promise<SearchResult>;
    searchUsers(query: string): Promise<Array<{
        id: string;
        username: string;
    }>>;
}
