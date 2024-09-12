import { Module } from '@nestjs/common'
import { ToursService } from './tours.service'
import { ToursController } from './tours.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Tour, TourSchema } from './schema/tours.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  providers: [ToursService],
  controllers: [ToursController],
})
export class ToursModule {}
