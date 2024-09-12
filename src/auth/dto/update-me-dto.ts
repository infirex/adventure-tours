import { IsEmail, MaxLength, MinLength } from 'class-validator'

export class updateMeDTO {
  @MaxLength(20)
  @MinLength(3)
  name: string

  @IsEmail()
  email: string
}
