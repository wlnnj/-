import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SongRequestsService } from './song-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('song-requests')
@UseGuards(JwtAuthGuard)
export class SongRequestsController {
    constructor(private readonly songRequestsService: SongRequestsService) { }

    // 用户提交歌曲求助
    @Post()
    async create(
        @Body() dto: { songName: string; artistName?: string },
        @Request() req: any,
    ) {
        return this.songRequestsService.create({
            songName: dto.songName,
            artistName: dto.artistName,
            userId: req.user.id,
            username: req.user.username,
        });
    }

    // 获取所有求助请求 (管理员)
    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAll() {
        return this.songRequestsService.findAll();
    }

    // 删除求助请求 (管理员)
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: string) {
        await this.songRequestsService.delete(id);
        return { message: '删除成功' };
    }
}
