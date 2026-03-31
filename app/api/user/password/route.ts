import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { sendEmail, passwordChangedEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    await connectDB();
    const user = await User.findById(session.user.id).select("+password");
    if (!user || !user.password) return NextResponse.json({ error: "Cannot change password for social accounts" }, { status: 400 });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    sendEmail({
      to: user.email,
      subject: "Your 5thJohnson password has been changed",
      html: passwordChangedEmailHtml(user.name),
    }).catch((err) => console.error("Password change email failed:", err));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
