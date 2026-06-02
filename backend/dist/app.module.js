"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const memos_module_1 = require("./memos/memos.module");
const posts_module_1 = require("./posts/posts.module");
const files_module_1 = require("./files/files.module");
const media_module_1 = require("./media/media.module");
const messages_module_1 = require("./messages/messages.module");
const calendar_module_1 = require("./calendar/calendar.module");
const admin_module_1 = require("./admin/admin.module");
const comments_module_1 = require("./comments/comments.module");
const search_module_1 = require("./search/search.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const user_isolation_guard_1 = require("./common/guards/user-isolation.guard");
const entities_1 = require("./entities");
const song_requests_module_1 = require("./song-requests/song-requests.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 100,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_DATABASE', 'zky_cloud'),
                    entities: [entities_1.User, entities_1.File, entities_1.Message, entities_1.Post, entities_1.Memo, entities_1.CalendarEvent, entities_1.Media, entities_1.RefreshToken, entities_1.Comment, entities_1.SongRequest],
                    synchronize: true,
                    logging: false,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            memos_module_1.MemosModule,
            posts_module_1.PostsModule,
            files_module_1.FilesModule,
            media_module_1.MediaModule,
            messages_module_1.MessagesModule,
            calendar_module_1.CalendarModule,
            admin_module_1.AdminModule,
            comments_module_1.CommentsModule,
            search_module_1.SearchModule,
            song_requests_module_1.SongRequestsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: user_isolation_guard_1.UserIsolationGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map