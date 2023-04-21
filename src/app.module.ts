import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AddressModule } from './modules/address/address.module';


@Module({
  imports: [BookingsModule, CustomersModule, AddressModule,],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
