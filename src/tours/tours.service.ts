import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Tour } from './schema/tours.schema'
import { Model, ObjectId } from 'mongoose'
import { CrudService } from 'src/common/crud.service'

@Injectable()
export class ToursService extends CrudService<Tour> {
  constructor(@InjectModel(Tour.name) private tourModel: Model<Tour>) {
    super(tourModel)
  }

  async getAllTours() {
    return await this.tourModel.find()
  }

  async getTour(id: ObjectId) {
    return await this.tourModel.findById(id)
  }

  async deleteTour(id: ObjectId) {
    return await this.deleteOne(id)
  }

  async updateTour(id: ObjectId, payload: Partial<Tour>) {
    return await this.updateOne(id, payload)
  }
}
