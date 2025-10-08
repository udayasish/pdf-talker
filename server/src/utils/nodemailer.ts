import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const transporter = nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN!,
  })
);

export async function sendVerificationEmail(
  from: string,
  to: string,
  name: string,
  token: string
): Promise<void> {
  //   const verificationUrl = `${process.env.BASE_URL}/api/v1/user/verify/${token}`;
  const verificationUrl = `verification email`;
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="text-align: center; color: #333;">PDF Talker - Email Verification</h2>

      <p>Dear ${capitalizedName},</p>

      <p>Welcome to PDF Talker! Please verify your email address by clicking the button below:</p>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationUrl}"
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
           Verify Email
        </a>
      </div>

      <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>

      <p>If you didn't create an account, please ignore this email.</p>

      <p>Best regards,<br>PDF Talker Team</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: "Verify Your Email - PDF Talker",
    html: htmlContent,
    text: `Dear ${name}, please verify your email by visiting: ${verificationUrl}`,
  });
}

export async function sendResetPasswordEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="text-align: center; color: #333;">PDF Talker - Password Reset</h2>

      <p>Dear ${capitalizedName},</p>

      <p>We received a request to reset your password. Click the button below to reset it:</p>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}"
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
           Reset Password
        </a>
      </div>

      <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>

      <p>If you didn't request this, please ignore this email.</p>
      <p>This link expires in 15 minutes.</p>

      <p>Best regards,<br>PDF Talker Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: "noreply@pdftalker.com",
    to,
    subject: "Reset Your Password - PDF Talker",
    html: htmlContent,
    text: `Dear ${name}, reset your password by visiting: ${resetUrl}`,
  });
}

// Legacy function for backward compatibility
export async function sendEmail(
  fromEmail: string,
  toEmail: string,
  token: string,
  name = ""
): Promise<void> {
  console.log("In send email");
  await sendVerificationEmail(fromEmail, toEmail, name || "User", token);
}
