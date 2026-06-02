import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
export interface SendMessageDto {
    receiverId: string;
    content: string;
}
export interface Conversation {
    userId: string;
    username: string;
    lastMessage: string;
    lastTime: Date;
    unreadCount: number;
}
export declare class MessagesService {
    private messageRepository;
    private userRepository;
    constructor(messageRepository: Repository<Message>, userRepository: Repository<User>);
    send(senderId: string, dto: SendMessageDto): Promise<Message>;
    getConversations(userId: string): Promise<Conversation[]>;
    getUnreadCount(userId: string): Promise<number>;
    getChatHistory(userId: string, otherUserId: string, page?: number, limit?: number): Promise<Message[]>;
    markAsRead(userId: string, senderId: string): Promise<void>;
    recallMessage(userId: string, messageId: string): Promise<Message>;
    deleteConversation(userId: string, otherUserId: string): Promise<void>;
    searchUsers(query: string): Promise<{
        id: string;
        username: string;
    }[]>;
}
