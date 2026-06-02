import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const SKIP_ISOLATION_KEY = 'skipIsolation';
export const SkipIsolation = () => Reflect.metadata(SKIP_ISOLATION_KEY, true);

/**
 * 用户数据隔离守卫
 * 确保用户只能访问自己的数据，除非标记为跳过隔离（如帖子模块）
 */
@Injectable()
export class UserIsolationGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const skipIsolation = this.reflector.getAllAndOverride<boolean>(SKIP_ISOLATION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (skipIsolation) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const params = request.params;
        const body = request.body;

        // 管理员跳过隔离检查
        if (user?.role === 'admin') {
            return true;
        }

        // 检查请求中的 userId 是否与当前用户匹配
        const requestedUserId = params?.userId || body?.userId;
        if (requestedUserId && requestedUserId !== user?.id) {
            throw new ForbiddenException('您无权访问其他用户的数据');
        }

        return true;
    }
}
