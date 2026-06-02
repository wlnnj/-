import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
}

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'file_name', length: 255 })
    fileName: string;

    @Column({ name: 'file_path', length: 500 })
    filePath: string;

    @Column({ name: 'file_size', type: 'bigint' })
    fileSize: number;

    @Column({ name: 'mime_type', length: 100 })
    mimeType: string;

    @Column({ type: 'enum', enum: MediaType })
    type: MediaType;

    @Column({ name: 'thumbnail_path', length: 500, nullable: true })
    thumbnailPath: string;

    @Column({ nullable: true })
    width: number;

    @Column({ nullable: true })
    height: number;

    @Column({ nullable: true })
    duration: number; // 视频时长(秒)

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
