"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const user_entity_1 = require("../entities/user.entity");
const refresh_token_entity_1 = require("../entities/refresh-token.entity");
let AuthService = class AuthService {
    constructor(userRepository, refreshTokenRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.REFRESH_TOKEN_EXPIRY_DAYS = 7;
        this.MAX_FAILED_ATTEMPTS = 5;
    }
    async register(username, password) {
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new common_1.ConflictException('用户名已存在');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = this.userRepository.create({
            username,
            passwordHash,
            role: user_entity_1.UserRole.USER,
            accentColor: user_entity_1.AccentColor.CYBER_BLUE,
        });
        await this.userRepository.save(user);
        return this.generateTokens(user);
    }
    async login(username, password) {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        if (user.isLocked) {
            throw new common_1.UnauthorizedException('账户已被锁定，请联系管理员');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            if (user.failedLoginAttempts >= this.MAX_FAILED_ATTEMPTS) {
                user.isLocked = true;
                await this.userRepository.save(user);
                throw new common_1.UnauthorizedException(`连续登录失败 ${this.MAX_FAILED_ATTEMPTS} 次，账户已被锁定`);
            }
            await this.userRepository.save(user);
            throw new common_1.UnauthorizedException(`用户名或密码错误 (剩余 ${this.MAX_FAILED_ATTEMPTS - user.failedLoginAttempts} 次尝试机会)`);
        }
        if (user.failedLoginAttempts > 0) {
            user.failedLoginAttempts = 0;
            await this.userRepository.save(user);
        }
        return this.generateTokens(user);
    }
    async refresh(refreshTokenStr) {
        const tokenRecord = await this.refreshTokenRepository.findOne({
            where: { token: refreshTokenStr, isRevoked: false },
            relations: ['user'],
        });
        if (!tokenRecord) {
            throw new common_1.UnauthorizedException('无效的刷新令牌');
        }
        if (new Date() > tokenRecord.expiresAt) {
            throw new common_1.UnauthorizedException('刷新令牌已过期，请重新登录');
        }
        if (tokenRecord.user.isLocked) {
            throw new common_1.UnauthorizedException('账户已被锁定，请联系管理员');
        }
        tokenRecord.isRevoked = true;
        await this.refreshTokenRepository.save(tokenRecord);
        return this.generateTokens(tokenRecord.user);
    }
    async logout(refreshTokenStr) {
        const tokenRecord = await this.refreshTokenRepository.findOne({
            where: { token: refreshTokenStr },
        });
        if (tokenRecord) {
            tokenRecord.isRevoked = true;
            await this.refreshTokenRepository.save(tokenRecord);
        }
    }
    async logoutAll(userId) {
        await this.refreshTokenRepository.update({ userId, isRevoked: false }, { isRevoked: true });
    }
    async updateAccentColor(userId, accentColor) {
        await this.userRepository.update(userId, { accentColor });
    }
    async validateUser(payload) {
        return this.userRepository.findOne({ where: { id: payload.sub } });
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshTokenStr = (0, uuid_1.v4)();
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map