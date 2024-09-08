import { vi } from 'vitest';

// __mocks__/nodemailer.ts
const nodemailer = {
  createTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue('Email sent successfully'),
  }),
};

export default nodemailer;
