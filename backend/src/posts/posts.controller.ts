import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { PostsService, CreatePostDto, UpdatePostDto } from './posts.service';
import { Post as PostEntity } from '../entities/post.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    create(@Request() req: any, @Body() dto: CreatePostDto): Promise<PostEntity> {
        return this.postsService.create(req.user.id, dto);
    }

    @Public() // 帖子列表公开访问
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
    ): Promise<{ posts: PostEntity[]; total: number }> {
        return this.postsService.findAll(parseInt(page), parseInt(limit));
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string): Promise<PostEntity> {
        return this.postsService.findOne(id);
    }

    @Put(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() dto: UpdatePostDto,
    ): Promise<PostEntity> {
        return this.postsService.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string): Promise<void> {
        const isAdmin = req.user.role === 'admin';
        return this.postsService.remove(req.user.id, id, isAdmin);
    }
}
