// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log('Required Roles:', requiredRoles);

    if (!requiredRoles) {
      return true; // No specific roles required, access is granted
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('Decoded Token:', user);
    console.log('User Roles:', user.roles);
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false; // User or roles are not properly defined, access denied
    }

    // Check if the user has any of the required roles
    const hasRequiredRole = user.roles.some((role) =>
      requiredRoles.includes(role),
    );

    return hasRequiredRole;
  }
}
