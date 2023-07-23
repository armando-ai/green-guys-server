import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class MailerService {
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
    }

    sendMail(to: string, subject: string, html: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `${process.env.EMAIL}`,
                to: to,
                subject: subject,
                html: html,
            };

            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);

                } else {
                    resolve(`Email sent: ${info.response}`);

                }
            });
        });
    }
}
