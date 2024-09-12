import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface';
import type { Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
import { getEmailServiceDefaults } from './utils/email-transport-defaults';
import type { SendEmailOptions } from './interfaces/send-email-options';

dotenv.config();

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    @Inject('EMAIL_SERVICE_OPTIONS') private options: EmailServiceOptions,
  ) {
    // Merge default options with the user-provided options
    const mergedOptions = this.mergeOptionsWithDefaults(options);
    this.transporter = this.createTransporter(mergedOptions);
  }

  // Method to merge user options with default options and environment variables
  private mergeOptionsWithDefaults(
    options: EmailServiceOptions,
  ): EmailServiceOptions {
    const defaults = getEmailServiceDefaults(options.service, options);

    return {
      ...defaults,
      ...options, // User-provided options override defaults
      auth: {
        user: process.env.USER_EMAIL || options.auth?.user, // Env or user-specified
        pass: process.env.USER_PASSWORD || options.auth?.pass, // Env or user-specified
      },
      from: process.env.EMAIL_FROM || options.from, // Default from address from env
    };
  }

  // Method to create the transporter with the merged options
  private createTransporter(options: EmailServiceOptions): Transporter {
    const { auth, ...rest } = options; // Separate auth from the rest of the options

    return nodemailer.createTransport({
      ...rest, // Spread the rest of the options (host, port, secure, etc.)
      auth: {
        user: auth?.user,
        pass: auth?.pass,
      },
    });
  }

  // Method to send an email
  async sendEmail(options: SendEmailOptions) {
    const { to, subject, text, html, from } = options;
    const senderEmail = from || this.options.from;

    if (!senderEmail) {
      throw new Error('The "from" email address is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(senderEmail)) {
      throw new Error('Invalid "from" email address');
    }

    if (!text && !html) {
      throw new Error('Either "text" or "html" content is required.');
    }

    const mailOptions = {
      from: senderEmail,
      to,
      subject,
      text, // Text content
      html, // HTML content
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
