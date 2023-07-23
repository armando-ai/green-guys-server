import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';


@Injectable()
export class BookingsService {

  constructor(@Inject(PrismaService)
  private readonly prisma: PrismaService, @Inject(MailerService) private readonly mailerService: MailerService) { }

  async create(createBookingDto: CreateBookingDto) {
    const { customerId, date } = createBookingDto;

    const { email, fname, lname, addressId } = await this.prisma.customer.findFirst({
      where: { id: customerId.trim() }
    })
    const customerName = fname + " " + lname;
    const { address, city, state, zipCode } = await this.prisma.address.findFirst({
      where: {
        id: addressId
      },
    })
    const customerAddress = `${address}, ${city}, ${state} ${zipCode}`;

    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        customerId: customerId,
        date: new Date(date)
      },
      include: {
        customer: {
          select: {
            addressId: true
          }
        }
      }
    })

    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      hourCycle: 'h23',
      ...(booking.date.getHours() >= 12 && { hour: 'numeric' }),
    });
    const dateShift = new Date(booking.date);
    dateShift.setHours(dateShift.getHours() + 6);

    const formattedDate = formatter.format(dateShift);
    const serviceTypes = getServiceTypesHtml(booking.serviceType);

    //customer
    await this.mailerService.sendMail(
      `${email}`,
      `Confirmation of Estimate Appointment ${formattedDate}`,
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; font-weight: 200;">Estimate Confirmation</title>
        </head>
        <body style="background-color:#7c9b70; padding:10px; text-align:"center"; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #345570; font-weight: 200;">
          <h1 style="font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 600; line-height: 1.2; color: #333333; font-size: 28px; margin-bottom: 16px; font-weight: 600;">Estimate Confirmation</h1>
          <div style = " padding:5px; >
            <p style="margin-bottom: 16px; font-weight: 200;">Dear ${customerName},</p>
            <p style="margin-bottom: 16px; font-weight: 200;">We are pleased to confirm your estimate on <span style="font-weight: 600;">${formattedDate}</span>.</p>
            <p style="margin-bottom: 16px; font-weight: 200;">Services requested:</p>
            ${serviceTypes}
            <p style="margin-bottom: 16px; font-weight: 200;">If you need to cancel or reschedule your appointment, please click the following button:</p>
            <p style="margin-bottom: 16px; font-weight: 200;"><a href="https://green-guys-landscaping.vercel.app/Cancel?id=${booking.customer.addressId}&type=customer" class="button" style="display: inline-block; font-size: 16px; padding: 10px 20px; background-color: #345570; color: #7c9b70; text-decoration: none; border-radius: 4px; font-weight: 200;">Cancel Appointment</a></p>
            <p style="margin-bottom: 16px; font-weight: 200;">Thank you for choosing our service.</p>
            <p style="margin-bottom: 16px; font-weight: 200;">Best regards,</p>
            <p style="margin-bottom: 16px; font-weight: 200;">Green Guys Landscaping</p>
          </div>
          <img  style="margin-inline:auto" src ="https://cdn.discordapp.com/attachments/846784414838030396/1087918795923935342/secondLogo.png">
          </body>
      </html>
      `
    );

    await this.mailerService.sendMail(
      `${process.env.EMAIL}`,
      `New Estimate Request Received ${formattedDate}`,
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; font-weight: 200;">New Estimate Request</title>
        </head>
        <body style="background-color:#7c9b70; padding:10px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #345570; font-weight: 200;">
          <h1 style="font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 600; line-height: 1.2; color: #333333; font-size: 28px; margin-bottom: 16px; font-weight: 600;">New Estimate Request</h1>
          <div style="padding: 5px;">
            <p style="margin-bottom: 16px; font-weight: 200;">Dear owner,</p>
            <p style="margin-bottom: 16px; font-weight: 200;">A new estimate has been requested by <span style="font-weight: 600;">${customerName}</span>.</p>
            <p style="margin-bottom: 16px; font-weight: 200;">Service types:</p>
            ${serviceTypes}
            <p style="margin-bottom: 16px; font-weight: 200;">Customer address:</p>
            <p style="margin-bottom: 16px; font-weight: 200; border-bottom:1px solid; padding:1px"><a href="https://maps.apple.com/?address=${customerAddress.replace(/ /g, '+')}" style="color: #345570; text-decoration: none;">${customerAddress}</a></p>
          </div>
          <p style="margin-bottom: 16px; font-weight: 200;">If you need to cancel, please click the following button:</p>
          <p style="margin-bottom: 16px; font-weight: 200;"><a href="https://green-guys-landscaping.vercel.app/Cancel?id=${booking.customer.addressId}&type=owner" class="button" style="display: inline-block; font-size: 16px; padding: 10px 20px; background-color: #345570; color: #7c9b70; text-decoration: none; border-radius: 4px; font-weight: 200;">Cancel Appointment</a></p>
          <img style="margin-inline:auto" src="https://cdn.discordapp.com/attachments/846784414838030396/1087918795923935342/secondLogo.png">
        </body>
      </html>
      `
    );

    //owner



    return { booking, email };
  }

  async findAll() {
    return "";
  }

  async remove(id: string) {
    const deleted = await this.prisma.address.delete(
      {
        where: {
          id: id
        }, include: {
          Customer: {
            include: {
              booking: true
            }
          }
        }
      }
    )
    const { fname, lname, email } = deleted.Customer
    const deleteInfo = {
      name: fname + " " + lname,
      bookingDate: new Date(deleted.Customer.booking.date)

    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      hourCycle: 'h23',
      ...(deleteInfo.bookingDate.getHours() >= 12 && { hour: 'numeric' }),
    });
    const dateShift = new Date(deleteInfo.bookingDate);
    dateShift.setHours(dateShift.getHours() + 6);

    const formattedDate = formatter.format(dateShift);
    await this.mailerService.sendMail(
      `${email}`,
      `Cancelled Appointment for ${formattedDate}`,
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; font-weight: 200;">Estimate Confirmation</title>
        </head>
        <body style="background-color:#7c9b70; padding:10px; text-align:"center"; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #345570; font-weight: 200;">
          <h1 style="font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 600; line-height: 1.2; color: #333333; font-size: 28px; margin-bottom: 16px; font-weight: 600;">Estimate Confirmation</h1>
          <div style = " padding:5px; >
            <p style="margin-bottom: 16px; font-weight: 200;">Dear ${deleteInfo.name},</p>
            <p style="margin-bottom: 16px; font-weight: 200;">We are sorry to see you cancel for <span style="font-weight: 600;">${formattedDate}</span>.</p>
            <p style="margin-bottom: 16px; font-weight: 200;">If you need schedule an appointment, please click the following button:</p>
            <p style="margin-bottom: 16px; font-weight: 200;"><a href="https://green-guys-landscaping.vercel.app/" class="button" style="display: inline-block; font-size: 16px; padding: 10px 20px; background-color: #345570; color: #7c9b70; text-decoration: none; border-radius: 4px; font-weight: 200;">Book Appointment</a></p>
            <p style="margin-bottom: 16px; font-weight: 200;">Thank you for choosing our service.</p>
            <p style="margin-bottom: 16px; font-weight: 200;">Best regards,</p>
            <p style="margin-bottom: 16px; font-weight: 200;">Green Guys Landscaping</p>
          </div>
          <img  style="margin-inline:auto" src ="https://cdn.discordapp.com/attachments/846784414838030396/1087918795923935342/secondLogo.png">
          </body>
      </html>
      `
    );

    await this.mailerService.sendMail(
      `${process.env.BOSS_EMAIL}`,
      `Estimate Cancellation for  ${formattedDate}`,
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; font-weight: 200;">New Estimate Request</title>
        </head>
        <body style="background-color:#7c9b70; padding:10px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #345570; font-weight: 200;">
          <h1 style="font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 600; line-height: 1.2; color: #333333; font-size: 28px; margin-bottom: 16px; font-weight: 600;">Estimate Cancellation</h1>
          <div style="padding: 5px;">
            <p style="margin-bottom: 16px; font-weight: 200;">Dear Boss,</p>
            <p style="margin-bottom: 16px; font-weight: 200;">An estimate for ${formattedDate}has been cancelled by <span style="font-weight: 600;">${deleteInfo.name}</span>.</p>
          </div>
           <img style="margin-inline:auto" src="https://cdn.discordapp.com/attachments/846784414838030396/1087918795923935342/secondLogo.png">
        </body>
      </html>
      `
    );
    return deleteInfo;

  }
  async getAppt(id: string) {
    const appt = await this.prisma.address.findFirst(
      {
        where: {
          id: id
        }, include: {
          Customer: {
            include: {
              booking: true
            }
          }
        }
      }
    );
    return appt;



  }
  async getUnAvailable() {

    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate());
    const bookings = await this.prisma.booking.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: targetDate,
          lt: endDate,
        },
      },
      _count: {
        date: true,
      },
    });

    const unAvailable = [];

    bookings.forEach(booking => {
      if (booking._count.date > 3) {
        unAvailable.push(`${booking.date.getMonth()}-${booking.date.getDate()}-${booking.date.getFullYear()}`);
      }
    });
    return unAvailable;
  }
  async findAvailable(date: string) {
    const targetDate = new Date(date)

    const tempDate = new Date(date);
    tempDate.setHours(17);

    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: targetDate,
          lte: tempDate
        },
      },
    });

    const presets = ["5", "6", "7"];
    if (bookings.length > 0) {
      bookings.forEach((element) => {
        let time = element.date.getHours() + 6;
        time = time - 12;
        const index = presets.indexOf(time.toString());
        if (index !== -1) {
          presets.splice(index, 1);
        }
      });

      return presets;
    }
    else {


      return presets;
    }


  }

}
function getServiceTypesHtml(serviceType: string[]) {
  let html = "";
  serviceType.forEach(element => {
    html = html + `<li  style="margin-bottom: 8px; font-weight: 300;">${element}</li>`;
  });
  return html;
}

