import { vi, describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email-service.js';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Mock } from 'vitest';
import type { EmailServiceOptions } from './interfaces/email-service-options.interface.js';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  createTransport: vi.fn(),
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let transporter: Transporter;

  const mockOptions: EmailServiceOptions = {
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    user: 'user@example.com',
    pass: 'password',
    from: 'noreply@example.com',
  };

  beforeEach(async () => {
    // Mock createTransport before initializing EmailService
    transporter = {
      sendMail: vi.fn().mockResolvedValue('Email sent successfully'),
    } as unknown as Transporter;

    (nodemailer.createTransport as Mock).mockReturnValue(transporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: 'EMAIL_SERVICE_OPTIONS',
          useValue: mockOptions,
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  it('should send an email', async () => {
    const result = await emailService.sendEmail(
      'recipient@example.com',
      'Test Subject',
      'Test Body',
    );

    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: mockOptions.from,
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    });

    expect(result).toBe('Email sent successfully');
  });
});
