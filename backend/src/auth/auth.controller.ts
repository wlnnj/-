import { Controller, Post, Body, Put, UseGuards, Request } from '@nestjs/common';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AuthService, LoginResponse } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { AccentColor } from '../entities/user.entity';


class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

class RefreshDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

class LogoutDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

class UpdateAccentColorDto {
    @IsEnum(AccentColor)
    accentColor: AccentColor;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<LoginResponse> {
        return this.authService.register(dto.username, dto.password);
    }

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto): Promise<LoginResponse> {
        return this.authService.login(dto.username, dto.password);
    }

    @Public()
    @Post('refresh')
    async refresh(@Body() dto: RefreshDto): Promise<LoginResponse> {
        return this.authService.refresh(dto.refreshToken);
    }

    @Post('logout')
    async logout(@Body() dto: LogoutDto): Promise<{ message: string }> {
        await this.authService.logout(dto.refreshToken);
        return { message: '已退出登录' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout-all')
    async logoutAll(@Request() req: any): Promise<{ message: string }> {
        await this.authService.logoutAll(req.user.id);
        return { message: '已从所有设备退出登录' };
    }

    @UseGuards(JwtAuthGuard)
    @Put('accent-color')
    async updateAccentColor(
        @Request() req: any,
        @Body() dto: UpdateAccentColorDto,
    ): Promise<{ message: string }> {
        await this.authService.updateAccentColor(req.user.id, dto.accentColor);
        return { message: '主题色已更新' };
    }
}
