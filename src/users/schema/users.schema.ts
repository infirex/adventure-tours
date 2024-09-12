import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { createHash, randomBytes } from 'crypto'
import { Role } from 'src/auth/enum/role.enum'

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
    maxLength: [20, 'Name must be less than 20 characters'],
    minLength: [3, 'Name must be more than 3 characters'],
  })
  name: string

  @Prop({
    type: String,
    enum: [Role.User, Role.Admin, Role.Guide, Role.LeadGuide],
    default: Role.User,
  })
  role: Role

  @Prop({
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  })
  email: string

  @Prop({
    type: String,
    required: [true, 'User must have a password'],
    minLength: [8, 'Password must be more than 8 characters'],
    maxLength: [40, 'Password must be less than 40 characters'],
    select: false,
  })
  password: string

  @Prop({
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE, not on UPDATE
      validator: function (el: string) {
        return el === this.password
      },
      message: 'Passwords do not match',
    },
    select: false,
  })
  passwordConfirm: string

  @Prop({ type: String, select: false })
  passwordResetToken: string

  @Prop({ type: Date, select: false })
  passwordResetExpires: Date | number

  @Prop({ type: Date, select: false })
  passwordChangedAt: Date | number

  photo: string

  @Prop({
    type: Boolean,
    default: true,
    select: false,
  })
  active: boolean

  createPasswordResetToken(): string {
    const resetToken = randomBytes(32).toString('hex')

    this.passwordResetToken = createHash('sha256')
      .update(resetToken)
      .digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
  }

  async correctPassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
  }
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.loadClass(User)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
  this.passwordConfirm = undefined
  this.passwordChangedAt = this.isNew ? undefined : Date.now() // check whether first password generation

  next()
})

// UserSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } })

//   next()
// })
