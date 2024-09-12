export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string; // Optional text content
  html?: string; // Optional HTML content
  from?: string; // Optional sender address
}
