import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail, passwordChangedEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();
    if (!email || !otp || !password) return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetToken: otp,
      resetTokenExpiry: { $gt: new Date() },
    }).select("+resetToken +resetTokenExpiry +password");

    if (!user) return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    sendEmail({
      to: user.email,
      subject: "Your 5thJohnson password has been changed",
      html: passwordChangedEmailHtml(user.name),
    }).catch((err) => console.error("Password change email failed:", err));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
