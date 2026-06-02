import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserRole, AccentColor } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
export interface JwtPayload {
    sub: string;
    username: string;
    role: UserRole;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        role: UserRole;
        accentColor: AccentColor;
    };
}
export declare class AuthService {
    private userRepository;
    private refreshTokenRepository;
    private jwtService;
    private configService;
    private readonly REFRESH_TOKEN_EXPIRY_DAYS;
    constructor(userRepository: Repository<User>, refreshTokenRepository: Repository<RefreshToken>, jwtService: JwtService, configService: ConfigService);
    register(username: string, password: string): Promise<LoginResponse>;
    private readonly MAX_FAILED_ATTEMPTS;
    login(username: string, password: string): Promise<LoginResponse>;
    refresh(refreshTokenStr: string): Promise<LoginResponse>;
    logout(refreshTokenStr: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    updateAccentColor(userId: string, accentColor: AccentColor): Promise<void>;
    validateUser(payload: JwtPayload): Promise<User | null>;
    private generateTokens;
}
