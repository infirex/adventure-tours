import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/users/schema/users.schema'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { JwtAuthGuard } from './guards/jwt.guard'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        defaults: {
          from: '<anonymous@dev.io>',
        },
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: configService.get('EMAIL_PORT'),
          auth: {
            user: configService.get('EMAIL_USERNAME'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
