import { PostsService, CreatePostDto, UpdatePostDto } from './posts.service';
import { Post as PostEntity } from '../entities/post.entity';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(req: any, dto: CreatePostDto): Promise<PostEntity>;
    findAll(page?: string, limit?: string): Promise<{
        posts: PostEntity[];
        total: number;
    }>;
    findOne(id: string): Promise<PostEntity>;
    update(req: any, id: string, dto: UpdatePostDto): Promise<PostEntity>;
    remove(req: any, id: string): Promise<void>;
}
