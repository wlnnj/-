import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
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

@Injectable()
export class AuthService {
    private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(username: string, password: string): Promise<LoginResponse> {
        // 检查用户名是否已存在
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new ConflictException('用户名已存在');
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 创建用户
        const user = this.userRepository.create({
            username,
            passwordHash,
            role: UserRole.USER,
            accentColor: AccentColor.CYBER_BLUE,
        });

        await this.userRepository.save(user);

        // 生成 JWT
        return this.generateTokens(user);
    }

    private readonly MAX_FAILED_ATTEMPTS = 5;

    async login(username: string, password: string): Promise<LoginResponse> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new UnauthorizedException('用户名或密码错误');
        }

        // 检查用户是否被锁定
        if (user.isLocked) {
            throw new UnauthorizedException('账户已被锁定，请联系管理员');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            // 增加失败计数
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            // 达到最大次数则锁定
            if (user.failedLoginAttempts >= this.MAX_FAILED_ATTEMPTS) {
                user.isLocked = true;
                await this.userRepository.save(user);
                throw new UnauthorizedException(`连续登录失败 ${this.MAX_FAILED_ATTEMPTS} 次，账户已被锁定`);
            }

            await this.userRepository.save(user);
            throw new UnauthorizedException(`用户名或密码错误 (剩余 ${this.MAX_FAILED_ATTEMPTS - user.failedLoginAttempts} 次尝试机会)`);
        }

        // 登录成功，重置失败计数
        if (user.failedLoginAttempts > 0) {
            user.failedLoginAttempts = 0;
            await this.userRepository.save(user);
        }

        return this.generateTokens(user);
    }

    async refresh(refreshTokenStr: string): Promise<LoginResponse> {
        // 查找 refresh token
        const tokenRecord = await this.refreshTokenRepository.findOne({
            where: { token: refreshTokenStr, isRevoked: false },
            relations: ['user'],
        });

        if (!tokenRecord) {
            throw new UnauthorizedException('无效的刷新令牌');
        }

        // 检查是否过期
        if (new Date() > tokenRecord.expiresAt) {
            throw new UnauthorizedException('刷新令牌已过期，请重新登录');
        }

        // 检查用户是否被锁定
        if (tokenRecord.user.isLocked) {
            throw new UnauthorizedException('账户已被锁定，请联系管理员');
        }

        // 撤销旧的 refresh token
        tokenRecord.isRevoked = true;
        await this.refreshTokenRepository.save(tokenRecord);

        // 生成新的 tokens
        return this.generateTokens(tokenRecord.user);
    }

    async logout(refreshTokenStr: string): Promise<void> {
        const tokenRecord = await this.refreshTokenRepository.findOne({
            where: { token: refreshTokenStr },
        });

        if (tokenRecord) {
            tokenRecord.isRevoked = true;
            await this.refreshTokenRepository.save(tokenRecord);
        }
    }

    async logoutAll(userId: string): Promise<void> {
        // 撤销用户的所有 refresh tokens
        await this.refreshTokenRepository.update(
            { userId, isRevoked: false },
            { isRevoked: true }
        );
    }

    async updateAccentColor(userId: string, accentColor: AccentColor): Promise<void> {
        await this.userRepository.update(userId, { accentColor });
    }

    async validateUser(payload: JwtPayload): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: payload.sub } });
    }

    private async generateTokens(user: User): Promise<LoginResponse> {
        const payload: JwtPayload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };

        // 生成 access token
        const accessToken = this.jwtService.sign(payload);

        // 生成 refresh token
        const refreshTokenStr = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

        const refreshToken = this.refreshTokenRepository.create({
            userId: user.id,
            token: refreshTokenStr,
            expiresAt,
        });
        await this.refreshTokenRepository.save(refreshToken);

        return {
            accessToken,
            refreshToken: refreshTokenStr,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                accentColor: user.accentColor,
            },
        };
    }
}
