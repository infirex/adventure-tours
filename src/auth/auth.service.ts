import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/users/schema/users.schema'
import { CreateUserDTO } from './dto/creat-user-dto'
import { JwtService } from '@nestjs/jwt'
import { LoginUserDTO } from './dto/login-user-dto'
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer'
import { ResetPasswordDTO } from './dto/reset-password-dto'
import { createHash } from 'crypto'
import { UpdatePasswordDTO } from './dto/update-password-dto'
import { IJwtPayload } from './interfaces/IJwtPayload'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async register(dto: CreateUserDTO) {
    const user = await this.userModel.create(dto)

    return {
      accessToken: this.createToken({
        email: user.email,
        id: user.id,
        role: user.role,
      }),
      user,
    }
  }

  async login(dto: LoginUserDTO) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password')

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return {
      accessToken: this.createToken({
        email: user.email,
        id: user.id,
        role: user.role,
      }),
      user,
    }
  }

  async forgotPassword(email: string, tokenUrlTemplate: string) {
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    const resetToken = user.createPasswordResetToken()

    await user.save({ validateBeforeSave: false })

    const resetTokenURL = `${tokenUrlTemplate}/${resetToken}`

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Password Reset Token',
      text: `Please click on the link to reset your password: ${resetTokenURL}`,
    })

    return 'Token sent to email!'
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDTO) {
    const hashedToken = createHash('sha256').update(token).digest('hex')

    const user = await this.userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) throw new BadRequestException('Token is invalid or has expired!')

    user.password = resetPasswordDto.newPassword
    user.passwordConfirm = resetPasswordDto.passwordConfirm
    user.passwordResetToken = undefined

    await user.save()

    return user
  }

  async updatePassword(
    user: Partial<User>,
    updatePasswordDto: UpdatePasswordDTO,
  ) {
    const currentUser = await this.userModel
      .findById(user.id)
      .select('+password')

    if (!(await currentUser.correctPassword(updatePasswordDto.password))) {
      throw new BadRequestException('Wrong password!')
    }

    currentUser.password = updatePasswordDto.newPassword
    currentUser.passwordConfirm = updatePasswordDto.newPasswordConfirm

    await currentUser.save()

    return 'Password changed successfully'
  }

  private createToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload)
  }
}
