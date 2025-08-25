import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 10, // 10 minutes for OTP
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };

    const alphabet = "0123456789";
    const length = 6; // 6-digit code to match our input field

    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "Meyoo <noreply@mail.meyoo.io>",
      to: [email],
      subject: `Your Meyoo verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to Meyoo</h2>
          <p>Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${token}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
      text: `Your Meyoo verification code is: ${token}\n\nThis code will expire in 10 minutes.`,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
