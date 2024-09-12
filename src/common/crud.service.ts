import { Injectable, NotFoundException } from '@nestjs/common'
import { Model, ObjectId } from 'mongoose'

@Injectable()
export class CrudService<T> {
  constructor(private readonly model: Model<T>) {}

  protected async deleteOne(id: ObjectId) {
    const doc = await this.model.findByIdAndDelete(id)

    if (!doc) throw new NotFoundException('No document fount with that ID')

    return doc
  }

  protected async updateOne(id: ObjectId, payload: Partial<T>) {
    const doc = await this.model.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })

    if (!doc) throw new NotFoundException('No doc found with that ID')

    return doc
  }
}
