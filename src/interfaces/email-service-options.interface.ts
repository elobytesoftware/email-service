// email-services.enum.ts
export enum EmailServices {
  Gmail = 'gmail',
  Office365 = 'office365',
  AwsSes = 'aws-ses',
}

export interface EmailServiceOptions {
  host?: string; // Optional, only for custom SMTP
  port?: number; // Optional, only for custom SMTP
  secure?: boolean; // Optional, only for custom SMTP
  service?: EmailServices | string; // Add support for service-based transporters and custom services
  auth?: {
    user?: string; // Email account username
    pass?: string; // Email account password
  };
  from?: string; // Sender address
  tls?: {
    ciphers?: string; // Optional field for additional TLS options
  };
}
