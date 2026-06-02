import { MessagesService, SendMessageDto, Conversation } from './messages.service';
import { Message } from '../entities/message.entity';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    send(req: any, dto: SendMessageDto): Promise<Message>;
    getConversations(req: any): Promise<Conversation[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    getChatHistory(req: any, contactId: string, page?: string, limit?: string): Promise<Message[]>;
    markAsRead(req: any, senderId: string): Promise<void>;
    searchUsers(query: string): Promise<{
        id: string;
        username: string;
    }[]>;
    deleteConversation(req: any, otherUserId: string): Promise<void>;
}
