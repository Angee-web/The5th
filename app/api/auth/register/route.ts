import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail, verifyEmailHtml } from "@/lib/email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() }).select("+verifyToken +verifyTokenExpiry");
    if (existing) {
      // If already registered but not verified, resend OTP
      if (!existing.emailVerified) {
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 30 * 60 * 1000);
        await User.findByIdAndUpdate(existing._id, { verifyToken: otp, verifyTokenExpiry: expiry });
        sendEmail({
          to: email.toLowerCase(),
          subject: "Your 5thJohnson verification code",
          html: verifyEmailHtml(existing.name, otp),
        }).catch((err) => console.error("Verify email failed:", err));
        return NextResponse.json({ message: "OTP resent. Please check your inbox." }, { status: 200 });
      }
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    console.log(`[DEV] Email verification OTP for ${email}: ${otp}`);
    const expiry = new Date(Date.now() + 30 * 60 * 1000);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "customer",
      emailVerified: false,
      verifyToken: otp,
      verifyTokenExpiry: expiry,
    });

    sendEmail({
      to: email.toLowerCase(),
      subject: "Your 5thJohnson verification code",
      html: verifyEmailHtml(name, otp),
    }).catch((err) => console.error("Verify email failed:", err));

    return NextResponse.json({ message: "Account created. Please check your email to verify your account." }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error", detail: String(err) }, { status: 500 });
  }
}
