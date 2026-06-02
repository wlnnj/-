import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongRequest } from '../entities/song-request.entity';

@Injectable()
export class SongRequestsService {
    constructor(
        @InjectRepository(SongRequest)
        private songRequestRepo: Repository<SongRequest>,
    ) { }

    async create(dto: { songName: string; artistName?: string; userId: string; username: string }): Promise<SongRequest> {
        const request = this.songRequestRepo.create({
            songName: dto.songName,
            artistName: dto.artistName,
            userId: dto.userId,
            username: dto.username,
            status: 'pending',
        });
        return this.songRequestRepo.save(request);
    }

    async findAll(): Promise<SongRequest[]> {
        return this.songRequestRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findByUserId(userId: string): Promise<SongRequest[]> {
        return this.songRequestRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async delete(id: string): Promise<void> {
        await this.songRequestRepo.delete(id);
    }

    async updateStatus(id: string, status: string): Promise<void> {
        await this.songRequestRepo.update(id, { status });
    }
}
