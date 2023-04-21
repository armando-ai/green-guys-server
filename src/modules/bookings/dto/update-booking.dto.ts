import { PartialType } from '@nestjs/mapped-types';
import { Booking } from '@prisma/client';
import { CreateBookingDto } from './create-booking.dto';


export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    id: string
}
