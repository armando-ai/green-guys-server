import { Customer } from "@prisma/client";

export class CreateCustomerDto {

    fname: string;
    lname: string;
    email: string;
    phone: string;
    addressId: string;
}
