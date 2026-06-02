import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('song_requests')
export class SongRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    songName: string;

    @Column({ nullable: true })
    artistName?: string;

    @Column()
    userId: string;

    @Column()
    username: string;

    @Column({ default: 'pending' })
    status: string; // pending, completed, rejected

    @CreateDateColumn()
    createdAt: Date;
}
