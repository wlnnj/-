import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('text')
    content: string;

    @Column({ type: 'jsonb', default: [] })
    images: string[];

    @Column({ name: 'comment_count', default: 0 })
    commentCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
