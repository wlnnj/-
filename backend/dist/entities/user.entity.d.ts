export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare enum AccentColor {
    CYBER_BLUE = "cyber-blue",
    NEON_GREEN = "neon-green",
    LAVA_RED = "lava-red"
}
export declare class User {
    id: string;
    username: string;
    passwordHash: string;
    role: UserRole;
    accentColor: AccentColor;
    failedLoginAttempts: number;
    isLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
