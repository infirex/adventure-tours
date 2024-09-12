import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IJwtPayload } from '../interfaces/IJwtPayload'

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  validate(payload: IJwtPayload): IJwtPayload {
    return payload
  }
}
