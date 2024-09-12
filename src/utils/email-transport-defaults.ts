import { EmailServices } from '../interfaces/email-service-options.interface';
import type { EmailServiceOptions } from '../interfaces/email-service-options.interface';

export function getEmailServiceDefaults(
  service: EmailServiceOptions['service'],
  options: EmailServiceOptions,
): Partial<EmailServiceOptions> {
  const resolvedService = service || EmailServices.Gmail; // Default to Gmail if no service is provided

  // Check if the service is one of the supported services
  if (Object.values(EmailServices).includes(resolvedService as EmailServices)) {
    switch (resolvedService) {
      case EmailServices.Gmail:
        return {
          host: 'smtp.gmail.com',
          port: options.secure ? 465 : 587,
          secure: options.secure !== false,
        };
      case EmailServices.Office365:
        return {
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          tls: { ciphers: 'SSLv3' },
        };
      case EmailServices.AwsSes:
        return {
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: 465,
          secure: true,
        };
    }
  }

  // Custom SMTP configuration for VPS or other servers
  return {
    host: options.host,
    port: options.port || 465,
    secure: options.secure !== undefined ? options.secure : true,
    auth: {
      user: options.auth?.user || process.env.USER_EMAIL,
      pass: options.auth?.pass || process.env.USER_PASSWORD,
    },
    from: options.from || process.env.USER_EMAIL,
  };
}
