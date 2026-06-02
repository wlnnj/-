import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'sender_id' })
    senderId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @Column({ name: 'receiver_id' })
    receiverId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;

    @Column('text')
    content: string;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @Column({ name: 'is_recalled', default: false })
    isRecalled: boolean;

    @Column({ name: 'deleted_by_sender', default: false })
    deletedBySender: boolean;

    @Column({ name: 'deleted_by_receiver', default: false })
    deletedByReceiver: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
