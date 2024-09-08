export interface EmailServiceOptions {
  host: string;
  port: number;
  secure: boolean; // True for 465, false for other ports
  user: string; // Your SMTP username
  pass: string; // Your SMTP password
  from: string; // Default sender email address
}
