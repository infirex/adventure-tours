import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common'
import { ToursService } from './tours.service'
import { Tour } from './schema/tours.schema'
import { ObjectId } from 'mongoose'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from 'src/auth/enum/role.enum'
import { Request } from 'express'

@Controller('tours')
export class ToursController {
  constructor(private tourService: ToursService) {}

  @Get()
  async getAllTours(): Promise<Tour[]> {
    return await this.tourService.getAllTours()
  }

  @Get(':id')
  async getTour(@Param('id') id: ObjectId) {
    return await this.tourService.getTour(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin, Role.LeadGuide)
  @Patch(':id')
  async updateTour(@Req() req: Request) {
    const id = req.params.id as unknown as ObjectId
    const payload = req.body
    return await this.tourService.updateTour(id, payload)
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin, Role.LeadGuide)
  @Patch(':id')
  async deleteTour(@Param('id') id: ObjectId) {
    return await this.tourService.deleteTour(id)
  }
}
