"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("../entities/message.entity");
const user_entity_1 = require("../entities/user.entity");
let MessagesService = class MessagesService {
    constructor(messageRepository, userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }
    async send(senderId, dto) {
        const receiver = await this.userRepository.findOne({ where: { id: dto.receiverId } });
        if (!receiver) {
            throw new common_1.NotFoundException('接收者不存在');
        }
        const message = this.messageRepository.create({
            senderId,
            receiverId: dto.receiverId,
            content: dto.content,
        });
        return this.messageRepository.save(message);
    }
    async getConversations(userId) {
        const messages = await this.messageRepository.query(`
            SELECT DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
                sender_id AS "senderId",
                receiver_id AS "receiverId",
                content,
                created_at AS "createdAt"
            FROM messages
            WHERE sender_id = $1 OR receiver_id = $1
            ORDER BY LEAST(sender_id, receiver_id) ASC, GREATEST(sender_id, receiver_id) ASC, created_at DESC
            `, [userId]);
        const conversations = [];
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
    async getUnreadCount(userId) {
        return this.messageRepository.count({
            where: { receiverId: userId, isRead: false },
        });
    }
    async getChatHistory(userId, otherUserId, page = 1, limit = 50) {
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
    async markAsRead(userId, senderId) {
        await this.messageRepository.update({ senderId, receiverId: userId, isRead: false }, { isRead: true });
    }
    async recallMessage(userId, messageId) {
        const message = await this.messageRepository.findOne({ where: { id: messageId } });
        if (!message)
            throw new common_1.NotFoundException('消息不存在');
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException('只能撤回自己发送的消息');
        }
        const now = new Date();
        const msgTime = new Date(message.createdAt);
        const diffMinutes = (now.getTime() - msgTime.getTime()) / 1000 / 60;
        if (diffMinutes > 2) {
            throw new common_1.ForbiddenException('发送超过2分钟的消息无法撤回');
        }
        message.isRecalled = true;
        return this.messageRepository.save(message);
    }
    async deleteConversation(userId, otherUserId) {
        await this.messageRepository.update({ senderId: userId, receiverId: otherUserId }, { deletedBySender: true });
        await this.messageRepository.update({ senderId: otherUserId, receiverId: userId }, { deletedByReceiver: true });
    }
    async searchUsers(query) {
        const whereConditions = [
            { username: (0, typeorm_2.Like)(`%${query}%`) }
        ];
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map