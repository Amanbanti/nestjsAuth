import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like SMTP, Outlook, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });
  }

  async sendResetPasswordEmail(email: string, resetToken: string) {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link expires in 1 hour.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
    return { message: 'Password reset email sent' };
  }
}
