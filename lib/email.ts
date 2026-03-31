import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function verifyEmailHtml(name: string, otp: string) {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#faf8f5;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;letter-spacing:2px;margin:0;">5thJohnson<span style="color:#c9a96e;">.</span></h1>
      </div>
      <h2 style="font-size:22px;font-weight:normal;margin-bottom:16px;">Verify your email</h2>
      <p style="color:#666;line-height:1.7;margin-bottom:16px;">Hi ${name},</p>
      <p style="color:#666;line-height:1.7;margin-bottom:24px;">
        Thanks for signing up! Use the code below to verify your email address. It expires in <strong>30 minutes</strong>.
      </p>
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;background:#1a1a1a;color:#fff;padding:18px 40px;font-size:32px;letter-spacing:10px;font-family:monospace;">${otp}</div>
      </div>
      <p style="color:#999;font-size:12px;line-height:1.6;">If you didn't create an account, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #e5e0d8;margin:32px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">© 5thJohnson. All rights reserved.</p>
    </div>
  `;
}

export function welcomeEmailHtml(name: string) {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#faf8f5;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;letter-spacing:2px;margin:0;">5thJohnson<span style="color:#c9a96e;">.</span></h1>
      </div>
      <h2 style="font-size:22px;font-weight:normal;margin-bottom:16px;">Welcome, ${name}!</h2>
      <p style="color:#666;line-height:1.7;margin-bottom:16px;">
        We're so glad you joined the 5thJohnson family. Your account has been created successfully.
      </p>
      <p style="color:#666;line-height:1.7;margin-bottom:32px;">
        Explore our latest collections and discover curated women's fashion made for you.
      </p>
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" style="background:#1a1a1a;color:#fff;padding:14px 32px;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Shop Now</a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e0d8;margin:32px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">© 5thJohnson. All rights reserved.</p>
    </div>
  `;
}

export function passwordChangedEmailHtml(name: string) {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#faf8f5;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;letter-spacing:2px;margin:0;">5thJohnson<span style="color:#c9a96e;">.</span></h1>
      </div>
      <h2 style="font-size:22px;font-weight:normal;margin-bottom:16px;">Password Updated</h2>
      <p style="color:#666;line-height:1.7;margin-bottom:16px;">Hi ${name},</p>
      <p style="color:#666;line-height:1.7;margin-bottom:32px;">
        Your password has been successfully updated. If you didn't make this change, please contact us immediately.
      </p>
      <hr style="border:none;border-top:1px solid #e5e0d8;margin:32px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">© 5thJohnson. All rights reserved.</p>
    </div>
  `;
}

export function otpEmailHtml(name: string, otp: string) {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#faf8f5;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;letter-spacing:2px;margin:0;">5thJohnson<span style="color:#c9a96e;">.</span></h1>
      </div>
      <h2 style="font-size:22px;font-weight:normal;margin-bottom:16px;">Reset Your Password</h2>
      <p style="color:#666;line-height:1.7;margin-bottom:16px;">Hi ${name},</p>
      <p style="color:#666;line-height:1.7;margin-bottom:24px;">
        Use the code below to reset your password. It expires in <strong>15 minutes</strong>.
      </p>
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;background:#1a1a1a;color:#fff;padding:18px 40px;font-size:32px;letter-spacing:10px;font-family:monospace;">${otp}</div>
      </div>
      <p style="color:#999;font-size:12px;line-height:1.6;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #e5e0d8;margin:32px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">© 5thJohnson. All rights reserved.</p>
    </div>
  `;
}
