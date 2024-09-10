import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    @Inject('EMAIL_SERVICE_OPTIONS') private options: EmailServiceOptions,
  ) {
    this.transporter = this.createTransporter(options);
  }

  private createTransporter(options: EmailServiceOptions): Transporter {
    if (options.service) {
      // Use predefined service like Gmail, Office365, etc.
      return nodemailer.createTransport({
        service: options.service,
        auth: {
          user: options.user,
          pass: options.pass,
        },
      });
    } else {
      // Use SMTP configuration
      return nodemailer.createTransport({
        host: options.host,
        port: options.port,
        secure: options.secure, // true for 465, false for other ports
        auth: {
          user: options.user,
          pass: options.pass,
        },
        tls: options.tls, // Add optional tls configuration
      });
    }
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
