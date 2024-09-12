import { ObjectId } from 'mongoose'
import { Role } from '../enum/role.enum'

export interface IJwtPayload {
  id: ObjectId
  email: string
  role: Role
}
