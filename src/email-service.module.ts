import { Module, Global } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';
import { EmailService } from './email-service';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface';

@Global()
@Module({})
export class EmailServiceModule {
  // Synchronous initialization with forRoot
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

  // Asynchronous initialization with forRootAsync
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
