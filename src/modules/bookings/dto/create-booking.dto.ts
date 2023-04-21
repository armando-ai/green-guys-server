
import { Booking } from '@prisma/client';

export class CreateBookingDto {
    date: Date
    isEstimate: boolean;
    customerId: string;
}

