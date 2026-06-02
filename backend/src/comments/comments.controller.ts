import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { CommentsService, CreateCommentDto } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Comment } from '../entities/comment.entity';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Request() req: any,
        @Body() dto: CreateCommentDto,
    ): Promise<Comment> {
        return this.commentsService.create(req.user.id, dto);
    }

    @Get('post/:postId')
    async findByPost(@Param('postId') postId: string): Promise<Comment[]> {
        return this.commentsService.findByPost(postId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(
        @Request() req: any,
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        const isAdmin = req.user.role === 'admin';
        await this.commentsService.remove(req.user.id, id, isAdmin);
        return { message: '评论已删除' };
    }
}
