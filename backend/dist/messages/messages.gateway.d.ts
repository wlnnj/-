import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly jwtService;
    server: Server;
    private onlineUsers;
    constructor(messagesService: MessagesService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, data: {
        receiverId: string;
        content: string;
    }): Promise<void>;
    handleTyping(client: Socket, data: {
        receiverId: string;
    }): void;
    handleRecallMessage(client: Socket, data: {
        messageId: string;
    }): Promise<void>;
    handleReadMessages(client: Socket, data: {
        senderId: string;
    }): Promise<void>;
    handleGetOnlineUsers(client: Socket): void;
}
