import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MemosModule } from './memos/memos.module';
import { PostsModule } from './posts/posts.module';
import { FilesModule } from './files/files.module';
import { MediaModule } from './media/media.module';
import { MessagesModule } from './messages/messages.module';
import { CalendarModule } from './calendar/calendar.module';
import { AdminModule } from './admin/admin.module';
import { CommentsModule } from './comments/comments.module';
import { SearchModule } from './search/search.module';
import { RedisModule } from './redis/redis.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserIsolationGuard } from './common/guards/user-isolation.guard';
import { User, File, Message, Post, Memo, CalendarEvent, Media, RefreshToken, Comment, SongRequest } from './entities';
import { SongRequestsModule } from './song-requests/song-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    // 速率限制配置
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,    // 1秒
        limit: 100,   // Relaxed for media streaming
      },
      {
        name: 'medium',
        ttl: 10000,   // 10秒
        limit: 20,    // 最多20次请求
      },
      {
        name: 'long',
        ttl: 60000,   // 1分钟
        limit: 100,   // 最多100次请求
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'zky_cloud'),
        entities: [User, File, Message, Post, Memo, CalendarEvent, Media, RefreshToken, Comment, SongRequest],
        synchronize: true, // 开发环境自动同步表结构
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MemosModule,
    PostsModule,
    FilesModule,
    MediaModule,
    MessagesModule,
    CalendarModule,
    AdminModule,
    CommentsModule,
    SearchModule,
    SongRequestsModule,
    // RedisModule, // 暂时注释掉以允许本地无 Redis 启动
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局速率限制守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserIsolationGuard,
    },
  ],
})
export class AppModule { }
