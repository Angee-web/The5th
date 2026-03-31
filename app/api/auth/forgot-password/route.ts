import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail, otpEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ message: "If that email exists, an OTP has been sent." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetToken = otp;
    user.resetTokenExpiry = expiry;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your 5thJohnson password reset code",
      html: otpEmailHtml(user.name, otp),
    });

    return NextResponse.json({ message: "If that email exists, an OTP has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
