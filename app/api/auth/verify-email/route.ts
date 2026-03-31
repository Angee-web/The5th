import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+verifyToken +verifyTokenExpiry");

    if (
      !user ||
      user.verifyToken !== otp ||
      !user.verifyTokenExpiry ||
      user.verifyTokenExpiry < new Date()
    ) {
      return NextResponse.json({ error: "Invalid or expired code. Please try again." }, { status: 400 });
    }

    user.emailVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    sendEmail({
      to: user.email,
      subject: "Welcome to 5thJohnson!",
      html: welcomeEmailHtml(user.name),
    }).catch((err) => console.error("Welcome email failed:", err));

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
