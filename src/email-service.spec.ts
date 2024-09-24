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
    auth: {
      user: 'user@example.com',
      pass: 'password',
    },
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
    const result = await emailService.sendEmail({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    });

    expect(transporter.sendMail).toHaveBeenCalledWith({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
      html: undefined, // Ensure HTML is not included
    });
    expect(result).toBe('Email sent successfully');
  });
  it('should send an email with HTML content', async () => {
    const result = await emailService.sendEmail({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test Body</p>',
    });

    expect(transporter.sendMail).toHaveBeenCalledWith({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: undefined, // Ensure text is not included
      html: '<p>Test Body</p>',
    });

    expect(result).toBe('Email sent successfully');
  });

  it('should throw an error if neither text nor HTML content is provided', async () => {
    await expect(() =>
      emailService.sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Subject',
      }),
    ).rejects.toThrow('Either "text" or "html" content is required.');
  });
});
