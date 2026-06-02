import { AuthService, LoginResponse } from './auth.service';
import { AccentColor } from '../entities/user.entity';
declare class RegisterDto {
    username: string;
    password: string;
}
declare class LoginDto {
    username: string;
    password: string;
}
declare class RefreshDto {
    refreshToken: string;
}
declare class LogoutDto {
    refreshToken: string;
}
declare class UpdateAccentColorDto {
    accentColor: AccentColor;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<LoginResponse>;
    login(dto: LoginDto): Promise<LoginResponse>;
    refresh(dto: RefreshDto): Promise<LoginResponse>;
    logout(dto: LogoutDto): Promise<{
        message: string;
    }>;
    logoutAll(req: any): Promise<{
        message: string;
    }>;
    updateAccentColor(req: any, dto: UpdateAccentColorDto): Promise<{
        message: string;
    }>;
}
export {};
