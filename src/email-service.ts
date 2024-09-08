import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface.js';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    @Inject('EMAIL_SERVICE_OPTIONS') private options: EmailServiceOptions,
  ) {
    this.transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure, // true for 465, false for other ports
      auth: {
        user: options.user, // SMTP username
        pass: options.pass, // SMTP password
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: this.options.from, // Sender address
      to,
      subject,
      text,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
