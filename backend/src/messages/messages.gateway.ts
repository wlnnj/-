import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';

interface MessagePayload {
    receiverId: string;
    content: string;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/chat',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // 在线用户映射: userId -> socketId
    private onlineUsers = new Map<string, string>();

    constructor(
        private readonly messagesService: MessagesService,
        private readonly jwtService: JwtService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            // 从 auth 对象或 query 中获取 token
            const token = client.handshake.auth?.token || client.handshake.query?.token;

            if (!token) {
                // Client missing token
                client.disconnect();
                return;
            }

            // 验证 Token
            const payload = await this.jwtService.verifyAsync(token);
            const userId = payload.sub;

            // 存储认证用户信息
            client.data.userId = userId;

            // 自动上线
            this.onlineUsers.set(userId, client.id);
            this.server.emit('userOnline', { userId });
            // User authenticated and online

        } catch (error) {
            // Socket authentication failed
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        // 如果未认证，client.data.userId 不存在
        const userId = client.data.userId;
        if (userId) {
            // User disconnected
            this.onlineUsers.delete(userId);
            this.server.emit('userOffline', { userId });
        }
    }

    // 已移除 handleJoin，因为连接时自动 Join

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { receiverId: string; content: string },
    ) {
        const senderId = client.data.userId;
        if (!senderId) return; // Should not happen if strictly disconnected

        // 保存消息到数据库
        const message = await this.messagesService.send(senderId, {
            receiverId: data.receiverId,
            content: data.content,
        });

        // 发送给接收者
        const receiverSocketId = this.onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            this.server.to(receiverSocketId).emit('newMessage', message);
        }

        // 也返回给发送者确认
        client.emit('messageSent', message);
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { receiverId: string },
    ) {
        const senderId = client.data.userId;
        if (!senderId) return;

        const receiverSocketId = this.onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            this.server.to(receiverSocketId).emit('userTyping', { userId: senderId });
        }
    }

    @SubscribeMessage('recallMessage')
    async handleRecallMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { messageId: string },
    ) {
        const userId = client.data.userId;
        if (!userId) return;

        try {
            const message = await this.messagesService.recallMessage(userId, data.messageId);

            // Notify sender
            client.emit('messageRecalled', { messageId: message.id });

            // Notify receiver if online
            const receiverSocketId = this.onlineUsers.get(message.receiverId);
            if (receiverSocketId) {
                this.server.to(receiverSocketId).emit('messageRecalled', { messageId: message.id });
            }
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }


    @SubscribeMessage('readMessages')
    async handleReadMessages(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { senderId: string }, // The user whose messages I am reading
    ) {
        const userId = client.data.userId; // Me (Reader)
        if (!userId) return;

        // Update DB
        await this.messagesService.markAsRead(userId, data.senderId);

        // Notify the SENDER that their messages have been read
        // data.senderId is the person who SENT the messages I am now reading.
        const senderSocketId = this.onlineUsers.get(data.senderId);
        if (senderSocketId) {
            // Tell them "userId" (Me) has read your messages
            this.server.to(senderSocketId).emit('messagesRead', {
                readerId: userId,
                conversationId: userId // For valid referencing if needed
            });
        }
    }

    // 获取在线用户列表
    @SubscribeMessage('getOnlineUsers')
    handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
        const onlineUserIds = Array.from(this.onlineUsers.keys());
        client.emit('onlineUsers', onlineUserIds);
    }
}
