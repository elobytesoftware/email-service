import { EmailServices } from '../interfaces/email-service-options.interface';
import type { EmailServiceOptions } from '../interfaces/email-service-options.interface';

export function getEmailServiceDefaults(): Partial<EmailServiceOptions> {
  const resolvedService =
    process.env.ELO_MAILER_SERVICE_NAME || EmailServices.Gmail; // Check env for service first, default to Gmail

  // Check if the service is one of the supported services
  if (Object.values(EmailServices).includes(resolvedService as EmailServices)) {
    switch (resolvedService) {
      case EmailServices.Gmail:
        return {
          host: process.env.ELO_MAILER_HOST || 'smtp.gmail.com',
          port: process.env.ELO_MAILER_SECURE === 'false' ? 587 : 465,
          secure: process.env.ELO_MAILER_SECURE
            ? process.env.ELO_MAILER_SECURE === 'true'
            : true,
        };
      case EmailServices.Office365:
        return {
          host: process.env.ELO_MAILER_HOST || 'smtp.office365.com',
          port: process.env.ELO_MAILER_PORT
            ? Number(process.env.ELO_MAILER_PORT)
            : 587,
          secure: process.env.ELO_MAILER_SECURE
            ? process.env.ELO_MAILER_SECURE === 'true'
            : false,
          tls: { ciphers: process.env.ELO_MAILER_TLS_CIPHERS || 'SSLv3' },
        };
      case EmailServices.AwsSes:
        return {
          host:
            process.env.ELO_MAILER_HOST || 'email-smtp.us-east-1.amazonaws.com',
          port: process.env.ELO_MAILER_PORT
            ? Number(process.env.ELO_MAILER_PORT)
            : 465,
          secure: process.env.ELO_MAILER_SECURE
            ? process.env.ELO_MAILER_SECURE === 'true'
            : true,
        };
    }
  }

  // Custom SMTP configuration
  if (resolvedService === 'smtp') {
    return {
      host: process.env.ELO_MAILER_HOST || 'localhost',
      port: process.env.ELO_MAILER_PORT
        ? Number(process.env.ELO_MAILER_PORT)
        : 465,
      secure: process.env.ELO_MAILER_SECURE
        ? process.env.ELO_MAILER_SECURE === 'true'
        : true,
    };
  }

  // Default fallback for unsupported service or unspecified service
  return {
    host: process.env.ELO_MAILER_HOST || 'localhost',
    port: process.env.ELO_MAILER_PORT
      ? Number(process.env.ELO_MAILER_PORT)
      : 465,
    secure: process.env.ELO_MAILER_SECURE
      ? process.env.ELO_MAILER_SECURE === 'true'
      : true,
  };
}
