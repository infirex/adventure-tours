import { Module } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Review, ReviewSchema } from './reviews.schema'
import { ReviewsController } from './reviews.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
