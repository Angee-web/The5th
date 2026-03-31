import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail, verifyEmailHtml } from "@/lib/email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ message: "If that email exists, a new code was sent." });
    if (user.emailVerified) return NextResponse.json({ error: "Email is already verified. Please sign in." }, { status: 400 });

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 30 * 60 * 1000);
    await User.findByIdAndUpdate(user._id, { verifyToken: otp, verifyTokenExpiry: expiry });

    sendEmail({
      to: user.email,
      subject: "Your 5thJohnson verification code",
      html: verifyEmailHtml(user.name, otp),
    }).catch((err) => console.error("Resend OTP failed:", err));

    return NextResponse.json({ message: "New code sent! Check your inbox." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
