import { Inject, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) { }
  async create(createAddressDto: CreateAddressDto) {

    const address = await this.prisma.address.create({
      data: createAddressDto
      , select: {
        id: true
      }
    })
    return address;
  }

  async findAnalytic() {
    const cityCounts = await this.prisma.address.groupBy({
      by: ['city'],
      _count: {
        city: true
      },
    });
    return cityCounts;
  }


}
