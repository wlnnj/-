import { Repository } from 'typeorm';
import { SongRequest } from '../entities/song-request.entity';
export declare class SongRequestsService {
    private songRequestRepo;
    constructor(songRequestRepo: Repository<SongRequest>);
    create(dto: {
        songName: string;
        artistName?: string;
        userId: string;
        username: string;
    }): Promise<SongRequest>;
    findAll(): Promise<SongRequest[]>;
    findByUserId(userId: string): Promise<SongRequest[]>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<void>;
}
