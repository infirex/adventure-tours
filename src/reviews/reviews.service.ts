import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Review } from './reviews.schema'
import { Model } from 'mongoose'

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async getAll() {
    return await this.reviewModel.find()
  }
}
