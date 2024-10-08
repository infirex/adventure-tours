import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '../enum/role.enum'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { IJwtPayload } from '../interfaces/IJwtPayload'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) return true

    const user: Partial<IJwtPayload> = context.switchToHttp().getRequest().user

    return requiredRoles.includes(user.role)
  }
}
