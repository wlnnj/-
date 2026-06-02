import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('files')
export class File {
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

    @Column({ name: 'mime_type', length: 100, nullable: true })
    mimeType: string;

    @Column({ name: 'qr_token', length: 100, nullable: true, unique: true })
    qrToken: string;

    @Column({ name: 'qr_expires_at', nullable: true })
    qrExpiresAt: Date;

    @Column({ name: 'is_public', default: false })
    isPublic: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
