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
    const defaults = getEmailServiceDefaults();

    return {
      ...defaults,
      ...options, // User-provided options override defaults
      auth: {
        user: process.env.ELO_MAILER_USER_EMAIL || options.auth?.user, // Updated env for user email
        pass: process.env.ELO_MAILER_USER_PASSWORD || options.auth?.pass, // Updated env for user password
      },
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
    const { to, subject, text, html, attachments } = options;

    if (!text && !html) {
      throw new Error('Either "text" or "html" content is required.');
    } else if (text && html) {
      throw new Error('Only one of "text" or "html" content is allowed.');
    }

    const mailOptions = {
      to,
      subject,
      text, // Text content
      html, // HTML content
      attachments,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
