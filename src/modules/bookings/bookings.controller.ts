import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { MailerService } from '../mailer/mailer.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, private readonly mailerService: MailerService) { }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {

    return this.bookingsService.create(createBookingDto);
  }


  @Get('/getAvailable/:date')
  findAvailable(@Param('date') date: string) {

    return this.bookingsService.findAvailable(date);
  }
  @Get('/getAppt/:id')
  findAppt(@Param('id') id: string) {

    return this.bookingsService.getAppt(id);
  }
  @Get('/getUnAvailable')
  findUnAvailable() {
    console.log("ping");
    return this.bookingsService.getUnAvailable();
  }




  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
