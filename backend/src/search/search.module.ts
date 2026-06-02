import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Memo } from '../entities/memo.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, Memo])],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule { }
