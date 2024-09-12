import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schema/users.schema'
import { Model, ObjectId } from 'mongoose'
import { updateMeDTO } from 'src/auth/dto/update-me-dto'
import { IJwtPayload } from 'src/auth/interfaces/IJwtPayload'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return await this.userModel.find()
  }

  async findOne(userId: ObjectId) {
    return await this.userModel.findById(userId)
  }

  async updateMe(dto: IJwtPayload & updateMeDTO) {
    return await this.userModel.findByIdAndUpdate(
      dto.id,
      {
        name: dto.name,
        email: dto.email,
      },
      { new: true, runValidators: true },
    )
  }

  async deleteMe(userID: ObjectId) {
    return await this.userModel.findByIdAndUpdate(userID, { active: false })
  }
}
