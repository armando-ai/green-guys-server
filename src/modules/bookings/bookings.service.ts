import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class BookingsService {
  constructor(@Inject(PrismaService)
  private readonly prisma: PrismaService, @Inject(MailerService) private readonly mailerService: MailerService) { }

  async create(createBookingDto: CreateBookingDto) {
    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto
      }
    })
    await this.mailerService.sendMail({
      to: 'armando.r6910@gmail.com',
      subject: 'Test email',
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Booking Confirmation</title>
          <style>
            /* Reset styles */
            body, h1, h2, h3, h4, h5, h6, p, blockquote, pre, dl, dd, ol, ul, figure, hr {
              margin: 0;
              padding: 0;
            }
      
            /* Typography */
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333333;
            }
      
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              font-weight: 600;
              line-height: 1.2;
              color: #333333;
            }
      
            h1 {
              font-size: 32px;
              margin-bottom: 16px;
            }
      
            h2 {
              font-size: 24px;
              margin-bottom: 16px;
            }
      
            p {
              margin-bottom: 16px;
            }
      
            /* Buttons */
            .button {
              display: inline-block;
              font-size: 16px;
              padding: 10px 20px;
              background-color: #0066cc;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
            }
      
            .button:hover {
              background-color: #0052a3;
            }
          </style>
        </head>
        <body>
          <h1>Booking Confirmation</h1>
          <p>Dear John,</p>
          <p>We are pleased to confirm your booking for a haircut on May 1st, 2023 at 10:00am.</p>
          <p>If you need to cancel or reschedule your appointment, please click the following button:</p>
          <p><a href="https://google.com" class="button">Cancel Appointment</a></p>
          <p>Thank you for choosing our service.</p>
          <p>Best regards,</p>
          <p>The Hair Salon</p>
        </body>
      </html>
      `,
    });
    return booking;
  }

  async findAll() {
    return "";
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  async remove(id: string) {
    const deleted = await this.prisma.booking.delete({
      where: {
        id: id
      }
    })

    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
  }
}
