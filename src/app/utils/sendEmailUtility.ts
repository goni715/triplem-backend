import config from "../config";
import nodemailer from "nodemailer";

const sendEmailUtility = async (EmailTo: string, name: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.smtp_username,
      pass: config.smtp_password,
    },
  });

  const mailOptions = {
    from: `TripleM ${config.smtp_from}`,
    to: EmailTo,
    subject: "Reset Your Password",
    html: `
    <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb; padding: 40px 0; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

        <!-- Header -->
        <div style="background: linear-gradient(90deg, #1e3a8a, #3b82f6); color: white; padding: 40px 20px;">
          <h1 style="font-size: 28px; margin: 0;">TripleM</h1>
          <p style="font-size: 16px; opacity: 0.9;">Secure Password Reset</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; text-align: left;">
          <h2 style="color: #111827; font-size: 22px; font-weight: 600; margin: 0 0 16px;">Hi ${name},</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Use the verification code below to continue.
          </p>

          <!-- OTP Section -->
          <div style="margin: 32px 0; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">Your one-time verification code:</p>
            <div style="display: inline-block; background: #1e3a8a; color: white; font-size: 30px; letter-spacing: 6px; font-weight: 700; padding: 18px 40px; border-radius: 10px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>

          <!-- Expiration Info -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">⏰ This code will expire in <strong>10 minutes</strong>.</p>
          </div>

          <!-- Security Tip -->
          <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px;">
            <p style="color: #991b1b; font-size: 14px; margin: 0;">⚠️ If you didn’t request this password reset, please ignore this message.</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © TripleM . All rights reserved.
          </p>
        </div>

      </div>
    </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmailUtility;
