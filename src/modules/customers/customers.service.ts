import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(@Inject(PrismaService)
  private readonly prisma: PrismaService) { }
  async create(createCustomerDto: CreateCustomerDto) {
    const { addressId } = createCustomerDto
    const customer = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        addressId: addressId
      }, select: {
        id: true
      }
    })
    return customer;
  }


}
