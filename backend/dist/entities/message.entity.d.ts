import { User } from './user.entity';
export declare class Message {
    id: string;
    senderId: string;
    sender: User;
    receiverId: string;
    receiver: User;
    content: string;
    isRead: boolean;
    isRecalled: boolean;
    deletedBySender: boolean;
    deletedByReceiver: boolean;
    createdAt: Date;
}
