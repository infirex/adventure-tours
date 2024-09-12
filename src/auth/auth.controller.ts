import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDTO } from './dto/creat-user-dto'
import { AuthService } from './auth.service'
import { LoginUserDTO } from './dto/login-user-dto'
import { Request } from 'express'
import { ResetPasswordDTO } from './dto/reset-password-dto'
import { UpdatePasswordDTO } from './dto/update-password-dto'
import { AuthGuard } from '@nestjs/passport'
import { User } from 'src/users/schema/users.schema'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: CreateUserDTO) {
    return await this.authService.register(signUpDto)
  }

  @Post('signin')
  async signin(@Body() signinDto: LoginUserDTO) {
    return await this.authService.login(signinDto)
  }

  @Post('forgot-password')
  async forgotPassword(@Req() req: Request) {
    const { email } = req.body
    const resetTokenURLTemplate = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password`

    return await this.authService.forgotPassword(email, resetTokenURLTemplate)
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDTO,
    @Param('token') token: string,
  ) {
    this.authService.resetPassword(token, resetPasswordDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-password')
  async updatePassword(@Req() req: Request) {
    const [user, dto] = [
      req.user as Partial<User>,
      req.body as UpdatePasswordDTO,
    ]
    return await this.authService.updatePassword(user, dto)
  }
}
