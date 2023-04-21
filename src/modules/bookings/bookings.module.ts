import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '@nest-modules/mailer';

@Module({
  imports: [PrismaModule, MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'greenguyslandscaping2017@gmail.com',
        pass: 'wulxooooekextpnp',
      },
    },
  })],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule { }
