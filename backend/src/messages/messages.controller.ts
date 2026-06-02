import { Controller, Get, Post, Body, Param, Query, Request, Put } from '@nestjs/common';
import { MessagesService, SendMessageDto, Conversation } from './messages.service';
import { Message } from '../entities/message.entity';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    send(@Request() req: any, @Body() dto: SendMessageDto): Promise<Message> {
        return this.messagesService.send(req.user.id, dto);
    }

    @Get('conversations')
    getConversations(@Request() req: any): Promise<Conversation[]> {
        return this.messagesService.getConversations(req.user.id);
    }

    @Get('unread-count')
    getUnreadCount(@Request() req: any): Promise<{ count: number }> {
        return this.messagesService.getUnreadCount(req.user.id).then(count => ({ count }));
    }

    @Get('history/:contactId')
    getChatHistory(
        @Request() req: any,
        @Param('contactId') contactId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50',
    ): Promise<Message[]> {
        return this.messagesService.getChatHistory(req.user.id, contactId, parseInt(page), parseInt(limit));
    }

    @Put('read/:senderId')
    markAsRead(@Request() req: any, @Param('senderId') senderId: string): Promise<void> {
        return this.messagesService.markAsRead(req.user.id, senderId);
    }

    @Get('search')
    searchUsers(@Query('q') query: string): Promise<{ id: string; username: string }[]> {
        return this.messagesService.searchUsers(query);
    }

    @Put('delete-conversation/:otherUserId')
    deleteConversation(
        @Request() req: any,
        @Param('otherUserId') otherUserId: string
    ): Promise<void> {
        return this.messagesService.deleteConversation(req.user.id, otherUserId);
    }
}
