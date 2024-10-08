# ELO MAILER Package

This package provides a simple, configurable email service for NestJS applications, built on top of `Nodemailer`. It supports various email providers and can be configured using environment variables or by providing custom options.

## Features

- Support for major email providers (Gmail, Office365, AWS SES, etc.).
- Ability to customize email sending configurations.
- Default configuration through environment variables.
- Supports both HTML and plain-text email templates.
- **Supports attachments** for sending files or inline images.

## Installation

```bash
npm install elo-mailer
```

## Usage

### 1. Configuration via Environment Variables

You can configure the email service using environment variables. The following variables are available:

#### Available Environment Variables

| Environment Variable       | Description                                                                                        | Default                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `ELO_MAILER_SERVICE_NAME`  | The email service provider (e.g., `gmail`, `office365`, `aws-ses`, `smtp`).                        | `gmail`                                   |
| `ELO_MAILER_HOST`          | The SMTP host for the email service provider.                                                      | Depends on the service name               |
| `ELO_MAILER_PORT`          | The SMTP port. If not provided, defaults to `465` for secure connections and `587` for non-secure. | `465` (if secure) / `587` (if not secure) |
| `ELO_MAILER_SECURE`        | Whether to use a secure connection (`true` or `false`).                                            | `true`                                    |
| `ELO_MAILER_USER_EMAIL`    | The email address to authenticate with and send emails from.                                       | `undefined` (required)                    |
| `ELO_MAILER_USER_PASSWORD` | The password for the email account used to authenticate the SMTP connection.                       | `undefined` (required)                    |
| `ELO_MAILER_FROM_EMAIL`    | The default email address used in the "from" field when sending emails.                            | Same as `ELO_MAILER_USER_EMAIL`           |
| `ELO_MAILER_TLS_CIPHERS`   | Custom TLS ciphers for secure connections (useful for Office365).                                  | `SSLv3` (for Office365)                   |

#### Example `.env` File

```bash
# Email service settings
ELO_MAILER_SERVICE_NAME=gmail

# Authentication details
ELO_MAILER_USER_EMAIL=example@gmail.com
ELO_MAILER_USER_PASSWORD=yourpassword

# Optional 'from' address
ELO_MAILER_FROM_EMAIL=customsender@example.com

# Optional custom TLS settings (for Office365)
ELO_MAILER_TLS_CIPHERS=SSLv3
```

### Notes:

- If you are using aws-ses or custom SMTP (`ELO_MAILER_SERVICE_NAME=aws-ses/smtp`), make sure to provide `ELO_MAILER_HOST`, `ELO_MAILER_PORT`, and `ELO_MAILER_SECURE` as needed.

### 2. Setting Up the Module

You can register the `EmailServiceModule` in your `AppModule` or any other module. The service can be registered with or without custom configuration.

#### Option 1: Using Default Environment Variables

```ts
import { Module } from '@nestjs/common';
import { EmailServiceModule } from 'elo-mailer';

@Module({
  imports: [EmailServiceModule.forRoot()], // Will pull settings from environment variables
})
export class AppModule {}
```

#### Option 2: Providing Custom Configuration

```bash
# Custom SMTP server settings
ELO_MAILER_SERVICE_NAME=smtp
ELO_MAILER_HOST=smtp.custom-server.com
ELO_MAILER_PORT=587
ELO_MAILER_SECURE=false  # Set to 'false' for non-secure connections, 'true' for secure

# Authentication details for the custom SMTP server
ELO_MAILER_USER_EMAIL=you@custom-server.com
ELO_MAILER_USER_PASSWORD=yourpassword

# Optional 'from' address
ELO_MAILER_FROM_EMAIL=support@custom-server.com

# Optional custom TLS settings (if needed for your server)
ELO_MAILER_TLS_CIPHERS=TLSv1.2
```

### 3. Sending Emails

Once the `EmailServiceModule` is registered, you can inject the `EmailService` into any of your services and use it to send emails.

```ts
import { Injectable } from '@nestjs/common';
import { EmailService } from 'elo-mailer';

@Injectable()
export class SomeService {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail() {
    await this.emailService.sendEmail({
      to: 'recipient@example.com',
      subject: 'Welcome!',
      text: 'Thank you for signing up!',
    });
  }
}
```

### 4. Sending Emails with Attachments

The `EmailService` now supports sending emails with attachments. You can include files, URLs, or inline images as attachments by providing an array of `Attachment` objects.

#### Example with Attachments:

```ts
await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Important documents',
  text: 'Please find the attached documents.',
  attachments: [
    {
      // Plain text attachment
      filename: 'text1.txt',
      content: 'hello world!',
    },
    {
      // Binary buffer as an attachment
      filename: 'text2.txt',
      content: Buffer.from('hello world!', 'utf-8'),
    },
    {
      // encoded string as an attachment
      filename: 'text1.txt',
      content: 'aGVsbG8gd29ybGQh',
      encoding: 'base64',
    },
    {
      // File on disk as an attachment
      filename: 'document.pdf',
      path: '/path/to/document.pdf', // Stream this file
    },
    {
      // Inline image (CID)
      filename: 'image.png',
      path: '/path/to/image.png',
      cid: 'unique@cid', // Specify content id for inline use
    },
  ],
});
```

#### Attachment Options

- `filename`: Name of the attached file.
- `content`: String, Buffer, or Stream content of the attachment.
- `path`: Path to the file or URL.
- `cid`: Content ID for inline use (images).
- `contentType`: Optional content type (derived automatically from the filename if not provided).

## API

### `EmailService`

#### `sendEmail(options: SendEmailOptions): Promise<void>`

Sends an email using the provided options.

```ts
interface SendEmailOptions {
  to: string; // Recipient email address
  subject: string; // Email subject
  text?: string; // Plain text content
  html?: string; // HTML content
  attachments?: Attachment[]; // Attachments for the email
}
```

### Notes:

- Either text or HTML content can be provided.
- Attachments can be added in various formats (files, URLs, inline images).

Example:

```ts
await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello World!',
  html: '<p>This is an HTML email with an attachment.</p>',
  attachments: [{ filename: 'text1.txt', content: 'Hello World!' }],
});
```

## License

This project is licensed under the MIT License.
