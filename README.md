# Email Service Package

This package provides a simple, configurable email service for NestJS applications, built on top of `Nodemailer`. It supports various email providers and can be configured using environment variables or by providing custom options.

## Features

- Support for major email providers (Gmail, Office365, AWS SES, etc.)
- Ability to customize email sending configurations.
- Default configuration through environment variables.
- Supports both HTML and plain-text email templates.

## Installation

```bash
npm install your-email-service-package
```

## Usage

### 1. Configuration via Environment Variables

You can configure the email service using environment variables. The following variables are available:

| Variable        | Description                            |
| --------------- | -------------------------------------- |
| `USER_EMAIL`    | The email address to send emails from. |
| `USER_PASSWORD` | The password for the email account.    |
| `EMAIL_FROM`    | The default "from" email address.      |

Example `.env` file:

```bash
USER_EMAIL=example@gmail.com
USER_PASSWORD=yourpassword
EMAIL_FROM=example@gmail.com
```

### 2. Setting Up the Module

You can register the `EmailServiceModule` in your `AppModule` or any other module. The service can be registered with or without custom configuration.

#### Option 1: Using Default Environment Variables

```ts
import { Module } from '@nestjs/common';
import { EmailServiceModule } from 'your-email-service-package';

@Module({
  imports: [EmailServiceModule.forRoot()], // Will pull settings from environment variables
})
export class AppModule {}
```

#### Option 2: Providing Custom Configuration

```ts
import { Module } from '@nestjs/common';
import { EmailServiceModule } from 'your-email-service-package';

@Module({
  imports: [
    EmailServiceModule.forRoot({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password',
      },
      from: 'your-email@gmail.com',
    }),
  ],
})
export class AppModule {}
```

### 3. Sending Emails

Once the `EmailServiceModule` is registered, you can inject the `EmailService` into any of your services and use it to send emails.

```ts
import { Injectable } from '@nestjs/common';
import { EmailService } from 'your-email-service-package';

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

### 4. Customization with Async Configuration

You can asynchronously configure the email service by using `forRootAsync`.

```ts
import { Module } from '@nestjs/common';
import { GmailController } from './gmail.controller';
import { GmailService } from './gmail.service';
import { EmailServiceModule } from 'elo-email-service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Make sure ConfigModule is imported
    EmailServiceModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is available here
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: configService.get<string>('GMAIL_USER'),
        pass: configService.get<string>('GMAIL_APP_PASSWORD'),
        from: configService.get<string>('GMAIL_USER'),
      }),
    }),
  ],
  controllers: [GmailController],
  providers: [GmailService],
})
export class GmailModule {}
```

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
  from?: string; // Sender email address (optional)
}
```

Example:

```ts
await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello World!',
  text: 'This is a plain text email.',
  html: '<p>This is an HTML email.</p>',
});
```

## License

This project is licensed under the MIT License.
