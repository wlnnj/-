import { SongRequestsService } from './song-requests.service';
export declare class SongRequestsController {
    private readonly songRequestsService;
    constructor(songRequestsService: SongRequestsService);
    create(dto: {
        songName: string;
        artistName?: string;
    }, req: any): Promise<import("../entities").SongRequest>;
    findAll(): Promise<import("../entities").SongRequest[]>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
