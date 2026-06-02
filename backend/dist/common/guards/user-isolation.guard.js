"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIsolationGuard = exports.SkipIsolation = exports.SKIP_ISOLATION_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.SKIP_ISOLATION_KEY = 'skipIsolation';
const SkipIsolation = () => Reflect.metadata(exports.SKIP_ISOLATION_KEY, true);
exports.SkipIsolation = SkipIsolation;
let UserIsolationGuard = class UserIsolationGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const skipIsolation = this.reflector.getAllAndOverride(exports.SKIP_ISOLATION_KEY, [
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
        if (user?.role === 'admin') {
            return true;
        }
        const requestedUserId = params?.userId || body?.userId;
        if (requestedUserId && requestedUserId !== user?.id) {
            throw new common_1.ForbiddenException('您无权访问其他用户的数据');
        }
        return true;
    }
};
exports.UserIsolationGuard = UserIsolationGuard;
exports.UserIsolationGuard = UserIsolationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], UserIsolationGuard);
//# sourceMappingURL=user-isolation.guard.js.map