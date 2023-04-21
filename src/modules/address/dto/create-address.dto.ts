import { Address } from "@prisma/client";

export class CreateAddressDto {
    address: string;
    city: string;
    state: string;
    zipCode: number;
}
