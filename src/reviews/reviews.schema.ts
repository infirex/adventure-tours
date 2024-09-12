import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, SchemaTypes } from 'mongoose'

@Schema()
export class Review extends Document {
  @Prop({
    type: String,
    minlength: [5, 'A review must have more or equal than 5 characters'],
    maxlength: [300, 'A review must have less or equal than 300 characters'],
  })
  review: string

  @Prop({
    type: Number,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  })
  rating: number

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date | number

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour'],
  })
  tour: ObjectId
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  })
  author: ObjectId
}

export const ReviewSchema = SchemaFactory.createForClass(Review)
