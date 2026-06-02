import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRequest } from '../entities/song-request.entity';
import { SongRequestsService } from './song-requests.service';
import { SongRequestsController } from './song-requests.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SongRequest])],
    controllers: [SongRequestsController],
    providers: [SongRequestsService],
    exports: [SongRequestsService],
})
export class SongRequestsModule { }
