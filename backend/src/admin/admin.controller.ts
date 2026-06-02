import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { AdminService, UserStats, SystemStats } from './admin.service';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    getSystemStats(): Promise<SystemStats> {
        return this.adminService.getSystemStats();
    }

    @Get('users')
    getAllUsers(): Promise<UserStats[]> {
        return this.adminService.getAllUsers();
    }

    @Put('users/:id/lock')
    lockUser(@Param('id') id: string): Promise<void> {
        return this.adminService.lockUser(id);
    }

    @Put('users/:id/unlock')
    unlockUser(@Param('id') id: string): Promise<void> {
        return this.adminService.unlockUser(id);
    }
}
