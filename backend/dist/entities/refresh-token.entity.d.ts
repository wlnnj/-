import { User } from './user.entity';
export declare class RefreshToken {
    id: string;
    userId: string;
    user: User;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt: Date;
}
