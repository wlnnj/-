import { AdminService, UserStats, SystemStats } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getSystemStats(): Promise<SystemStats>;
    getAllUsers(): Promise<UserStats[]>;
    lockUser(id: string): Promise<void>;
    unlockUser(id: string): Promise<void>;
}
