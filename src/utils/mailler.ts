import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export class Mailer {
  static async sendMail(options: MailOptions) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        ...options,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  static async sendForgotPasswordMail(email: string, newPassword: string) {
    const mailOptions = {
      to: email,
      subject: "Your New Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2c3e50;">Password Reset</h2>
          <p>Your new password is: <strong style="background: #f8f9fa; padding: 5px 10px; border-radius: 4px;">${newPassword}</strong></p>
          <p>For security reasons, please login and change your password immediately.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            If you didn't request this password reset, please contact support immediately.
          </p>
        </div>
      `,
    };

    return await this.sendMail(mailOptions);
  }

  static async sendWelcomeMail(email: string, username: string) {
    const mailOptions = {
      to: email,
      subject: "Welcome to Our Platform",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2c3e50;">Welcome ${username}!</h2>
          <p>Thank you for joining our platform.</p>
          <p>We're excited to have you on board!</p>
        </div>
      `,
    };

    return await this.sendMail(mailOptions);
  }
}
