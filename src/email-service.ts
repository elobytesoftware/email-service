import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface';
import type { Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
import { getEmailServiceDefaults } from './utils/email-transport-defaults';
dotenv.config();

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    @Inject('EMAIL_SERVICE_OPTIONS') private options: EmailServiceOptions,
  ) {
    this.transporter = this.createTransporter(options);
  }

  private createTransporter(options: EmailServiceOptions): Transporter {
    const defaults = getEmailServiceDefaults(options.service, options);

    const transporterOptions = {
      ...defaults,
      ...options, // User-provided options will override defaults
      auth: {
        user: process.env.USER_EMAIL || options.user,
        pass: process.env.USER_PASSWORD || options.pass,
      },
    };

    return nodemailer.createTransport(transporterOptions);
  }

  async sendEmail(to: string, subject: string, text: string, from?: string) {
    const senderEmail = from || this.options.from;

    if (!senderEmail) {
      throw new Error('The "from" email address is required.');
    }

    // Basic email validation regex (simple check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(senderEmail)) {
      throw new Error('Invalid "from" email address');
    }

    const mailOptions = {
      from: senderEmail, // Use the validated 'from' email
      to,
      subject,
      text,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
