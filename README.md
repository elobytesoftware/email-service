# email-service

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
