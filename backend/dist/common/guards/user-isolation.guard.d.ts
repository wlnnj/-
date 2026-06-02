import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const SKIP_ISOLATION_KEY = "skipIsolation";
export declare const SkipIsolation: () => {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare class UserIsolationGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
