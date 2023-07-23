import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get('/analytic/:code')
  getAnalytic(@Param('code') code: string) {
    if (code.trim() === process.env.ANALYTIC_PASS) {
      return this.addressService.findAnalytic();
    } else {
      return new UnauthorizedException();
    }

  }
}
