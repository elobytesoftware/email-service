import type { Attachment } from 'nodemailer/lib/mailer';

export interface SendEmailOptionsBase {
  to: string;
  subject: string;
  attachments?: Attachment[];
}

export interface SendEmailOptionsWithText extends SendEmailOptionsBase {
  text: string; // Required
  html?: string; // Optional
}

export interface SendEmailOptionsWithHtml extends SendEmailOptionsBase {
  html: string; // Required
  text?: string; // Optional
}

// Union type
export type SendEmailOptions =
  | SendEmailOptionsWithText
  | SendEmailOptionsWithHtml;
