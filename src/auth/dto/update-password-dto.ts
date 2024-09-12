import { IsNotEmpty } from 'class-validator'

export class UpdatePasswordDTO {
  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  newPassword: string

  @IsNotEmpty()
  newPasswordConfirm: string
}
