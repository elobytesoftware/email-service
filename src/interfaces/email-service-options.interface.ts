export interface EmailServiceOptions {
  host?: string; // Optional, only for SMTP
  port?: number; // Optional, only for SMTP
  secure?: boolean; // Optional, only for SMTP
  service?: 'gmail' | 'office365' | 'aws-ses'; // Add support for service-based transporters
  user?: string;
  pass?: string;
  from?: string; // Sender address
  // Optional field for additional options like tls
  tls?: {
    ciphers?: string;
  };
}
