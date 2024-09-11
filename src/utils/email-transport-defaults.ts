import type { EmailServiceOptions } from '../interfaces/email-service-options.interface';

export function getEmailServiceDefaults(
  service: EmailServiceOptions['service'],
  options: EmailServiceOptions,
): Partial<EmailServiceOptions> {
  switch (service) {
    case 'gmail':
      return {
        host: 'smtp.gmail.com',
        port: options.secure ? 465 : 587,
        secure: options.secure !== false, // Secure is true by default
      };
    case 'office365':
      return {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        tls: { ciphers: 'SSLv3' },
      };
    case 'aws-ses':
      return {
        host: 'email-smtp.us-east-1.amazonaws.com', // Update region as needed
        port: 465,
        secure: true,
      };
    // Add more providers as needed
    default:
      return {}; // Defaults for other services or custom SMTP
  }
}
