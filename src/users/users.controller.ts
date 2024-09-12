import { Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from 'src/auth/enum/role.enum'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { updateMeDTO } from 'src/auth/dto/update-me-dto'
import { Request } from 'express'
import { IJwtPayload } from 'src/auth/interfaces/IJwtPayload'

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.User)
  async getAll() {
    return await this.userService.findAll()
  }

  @Patch('/updateMe')
  @UseGuards(AuthGuard('jwt'))
  async updateMe(@Req() req: Request) {
    const dto: IJwtPayload & updateMeDTO = {
      ...req.user,
      ...req.body,
    }

    return await this.userService.updateMe(dto)
  }

  @Delete('/deleteMe')
  @UseGuards(AuthGuard('jwt'))
  async deleteModel(@Req() req: Request) {
    const { id } = req.user as IJwtPayload
    return await this.userService.deleteMe(id)
  }
}
