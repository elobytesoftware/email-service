import { Module, Global } from '@nestjs/common';
import { EmailService } from './email-service';
import type { DynamicModule } from '@nestjs/common';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface';

@Global()
@Module({
  providers: [
    EmailService,
    {
      provide: 'EMAIL_SERVICE_OPTIONS',
      useValue: {
        service: 'gmail',
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD,
        },
        from: process.env.USER_EMAIL,
      } as EmailServiceOptions, // Provide default values
    },
  ],
  exports: [EmailService],
})
export class EmailServiceModule {
  // Default options will be fetched from environment variables inside the service
  static register(options?: EmailServiceOptions): DynamicModule {
    return {
      module: EmailServiceModule,
      providers: [
        {
          provide: 'EMAIL_SERVICE_OPTIONS',
          useValue: options || {}, // Pass empty object if no options provided
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }

  // Synchronous initialization with forRoot (for manual configuration)
  static forRoot(options: EmailServiceOptions): DynamicModule {
    return this.register(options);
  }

  // Asynchronous initialization with forRootAsync (for manual configuration)
  static forRootAsync(optionsProvider: {
    useFactory: (
      ...args: any[]
    ) => Promise<EmailServiceOptions> | EmailServiceOptions;
    inject?: any[];
    imports?: any[];
  }): DynamicModule {
    return {
      module: EmailServiceModule,
      imports: optionsProvider.imports || [],
      providers: [
        {
          provide: 'EMAIL_SERVICE_OPTIONS',
          useFactory: optionsProvider.useFactory,
          inject: optionsProvider.inject || [],
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
