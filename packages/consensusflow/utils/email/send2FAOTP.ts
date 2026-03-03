import { db } from "@workspace/consensusflow/db";
import { eq } from "drizzle-orm";

// import { resend } from "@workspace/consensusflow/const/const";
import { generate2FAOTP } from "@workspace/consensusflow/utils/generator/otp/2FAotpgen";
import { otptable } from "@workspace/consensusflow/db/schema";
import { Resend } from "resend";

export const send2FAOTP = async (email: string) => {
  const resend = await new Resend(process.env.RESEND_API_KEY!);

  try {
    const existingOTP = await db.query.otptable.findFirst({
      where: eq(otptable.email, email),
    });

    if (existingOTP && existingOTP.expiresAt > new Date()) {
      const otp = existingOTP.otp;

      const expiryMinutes = existingOTP.expiresAt.getTime() - Date.now();

      const res = await resend.emails.send({
        to: email,
        from: "noreply-consensusflow@resend.dev",
        subject: "🔐 Your OTP Code - Verify Your Account",
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { padding: 40px; text-align: center; }
              .content p { color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0; }
              .otp-box { background-color: #f0f0f0; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 30px 0; }
              .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; }
              .expiry { color: #666; font-size: 14px; margin-top: 15px; }
              .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
              .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Verify Your Account</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Your one-time password (OTP) for account verification is:</p>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                  <div class="expiry">⏱️ This code expires in ${expiryMinutes} minutes</div>
                  <br/>
                  <p>At exactly ${existingOTP.expiresAt.toUTCString()}.</p>
                  <p>Do conversion for clear time as needed!</p>
                </div>
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong> Never share this code with anyone. We will never ask you for this code via email or phone.
                </div>
                <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email or contact our support team.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ConsensusFlow. All rights reserved. | <a href="" style="color: #667eea; text-decoration: none;">Visit our website</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
        text: `Your OTP: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.\n\nDo not share this code with anyone.`,
      });

      return { success: Promise };
    } else {
      const otp = generate2FAOTP();

      await db.insert(otptable).values({
        email: email,
        otp: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
      });

      const OTPuser = await db.query.otptable.findFirst({
        where: eq(otptable.email, email),
      });

      const expiryMinutes = OTPuser!.expiresAt.getTime() - Date.now();

      const res = await resend.emails.send({
        to: email,
        from: "noreply-consensusflow@resend.dev",
        subject: "🔐 Your OTP Code - Verify Your Account",
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { padding: 40px; text-align: center; }
              .content p { color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0; }
              .otp-box { background-color: #f0f0f0; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 30px 0; }
              .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; }
              .expiry { color: #666; font-size: 14px; margin-top: 15px; }
              .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
              .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Verify Your Account</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Your one-time password (OTP) for account verification is:</p>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                  <div class="expiry">⏱️ This code expires in ${expiryMinutes} minutes</div>
                  <br/>
                  <p>At exactly ${OTPuser!.expiresAt.toUTCString()}.</p>
                  <p>Do conversion for clear time as needed!</p>
                </div>
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong> Never share this code with anyone. We will never ask you for this code via email or phone.
                </div>
                <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email or contact our support team.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ConsensusFlow. All rights reserved. | <a href="" style="color: #667eea; text-decoration: none;">Visit our website</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
        text: `Your OTP: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.\n\nDo not share this code with anyone.`,
      });

      return { success: Promise };
    }
  } catch {
    return { error: "Something Went Wrong While Sending The OTP!" };
  }
};
