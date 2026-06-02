import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Or } from 'typeorm';
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

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async send(senderId: string, dto: SendMessageDto): Promise<Message> {
        const receiver = await this.userRepository.findOne({ where: { id: dto.receiverId } });
        if (!receiver) {
            throw new NotFoundException('接收者不存在');
        }

        const message = this.messageRepository.create({
            senderId,
            receiverId: dto.receiverId,
            content: dto.content,
        });
        return this.messageRepository.save(message);
    }

    // 获取会话列表
    async getConversations(userId: string): Promise<Conversation[]> {
        const messages = await this.messageRepository.query(
            `
            SELECT DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
                sender_id AS "senderId",
                receiver_id AS "receiverId",
                content,
                created_at AS "createdAt"
            FROM messages
            WHERE sender_id = $1 OR receiver_id = $1
            ORDER BY LEAST(sender_id, receiver_id) ASC, GREATEST(sender_id, receiver_id) ASC, created_at DESC
            `,
            [userId]
        );

        const conversations: Conversation[] = [];
        for (const msg of messages) {
            const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            const user = await this.userRepository.findOne({ where: { id: otherId } });
            if (user) {
                const unreadCount = await this.messageRepository.count({
                    where: {
                        senderId: otherId,
                        receiverId: userId,
                        isRead: false,
                    },
                });
                conversations.push({
                    userId: otherId,
                    username: user.username,
                    lastMessage: msg.content,
                    lastTime: msg.createdAt,
                    unreadCount,
                });
            }
        }
        return conversations;
    }

    // 获取总未读消息数
    async getUnreadCount(userId: string): Promise<number> {
        return this.messageRepository.count({
            where: { receiverId: userId, isRead: false },
        });
    }

    async getChatHistory(userId: string, otherUserId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: [
                { senderId: userId, receiverId: otherUserId, deletedBySender: false },
                { senderId: otherUserId, receiverId: userId, deletedByReceiver: false },
            ],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return messages;
    }

    // 标记消息为已读
    async markAsRead(userId: string, senderId: string): Promise<void> {
        await this.messageRepository.update(
            { senderId, receiverId: userId, isRead: false },
            { isRead: true },
        );
    }

    // 撤回消息
    async recallMessage(userId: string, messageId: string): Promise<Message> {
        const message = await this.messageRepository.findOne({ where: { id: messageId } });
        if (!message) throw new NotFoundException('消息不存在');

        if (message.senderId !== userId) {
            throw new ForbiddenException('只能撤回自己发送的消息');
        }

        const now = new Date();
        const msgTime = new Date(message.createdAt);
        const diffMinutes = (now.getTime() - msgTime.getTime()) / 1000 / 60;

        if (diffMinutes > 2) {
            throw new ForbiddenException('发送超过2分钟的消息无法撤回');
        }

        message.isRecalled = true;
        return this.messageRepository.save(message);
    }

    // 删除会话 (软删除)
    async deleteConversation(userId: string, otherUserId: string): Promise<void> {
        // Mark as deleted for sender
        await this.messageRepository.update(
            { senderId: userId, receiverId: otherUserId },
            { deletedBySender: true }
        );
        // Mark as deleted for receiver (checking receiverId = userId)
        await this.messageRepository.update(
            { senderId: otherUserId, receiverId: userId },
            { deletedByReceiver: true }
        );
    }

    // 搜索用户
    async searchUsers(query: string): Promise<{ id: string; username: string }[]> {
        const whereConditions: any[] = [
            { username: Like(`%${query}%`) }
        ];

        // Only search using ID if the query is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(query)) {
            whereConditions.push({ id: query });
        }

        const users = await this.userRepository.find({
            where: whereConditions,
            select: ['id', 'username'],
            take: 20,
        });
        return users;
    }
}
