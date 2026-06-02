import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../entities/user.entity';
import { File } from '../entities/file.entity';
import { Media } from '../entities/media.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, File, Media, RefreshToken])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
