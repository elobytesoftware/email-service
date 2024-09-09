import { Module, Global } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';
import { EmailService } from './email-service';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface';

// Make it available globally, if needed
@Global()
@Module({})
export class EmailServiceModule {
  static forRoot(options: EmailServiceOptions): DynamicModule {
    return {
      module: EmailServiceModule,
      providers: [
        {
          provide: 'EMAIL_SERVICE_OPTIONS',
          useValue: options,
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
