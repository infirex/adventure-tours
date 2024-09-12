import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes } from 'mongoose'

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Tour extends Document {
  @Prop({
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    minlength: [5, 'A tour name must have more or equal than 5 characters'],
    maxlength: [40, 'A tour name must have less or equal than 40 characters'],
  })
  name: string

  @Prop({
    type: Number,
    required: [true, 'A tour must have a duration'],
  })
  duration: number

  @Prop({
    type: Number,
    required: [true, 'A tour must have a group size'],
  })
  maxGroupSize: number

  @Prop({ type: String })
  slug: string

  @Prop({
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium or difficult',
    },
  })
  difficulty: string

  @Prop({
    type: Number,
    default: 1.0,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val: number) => +val.toFixed(2),
  })
  ratingsAverage: number

  @Prop({
    type: Number,
    default: 0,
  })
  ratingsQuantity: number

  @Prop({
    type: Number,
    required: [true, 'A tour must have a price'],
  })
  price: number

  @Prop({
    type: Number,
    validate: {
      validator: function (val: number) {
        return val < this.price
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
  })
  priceDiscount: number

  @Prop({
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  })
  summary: string

  @Prop({
    type: String,
    trim: true,
  })
  description: string

  @Prop({
    type: String,
    required: [true, 'A tour must have a cover image'],
  })
  imageCover: string

  @Prop([String])
  images: string[]

  @Prop({
    type: Date,
    default: Date.now,
    select: false,
  })
  createdAt: Date

  @Prop([Date])
  startDates: Date[]

  @Prop({
    type: Boolean,
    default: false,
  })
  secretTour: boolean

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'User' }])
  guides: string[]

  @Prop({
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  })
  startLocation: any

  @Prop([
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ])
  locations: any[]
}

export const TourSchema = SchemaFactory.createForClass(Tour)
