"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      toast.success("OTP sent! Check your inbox.");
      setStep("otp");
    } else {
      const data = await res.json();
      toast.error(data.error || "Something went wrong");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Password updated! Please sign in.");
      router.push("/login");
    } else {
      toast.error(data.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold">
            5thJohnson<span className="text-brand-gold">.</span>
          </Link>
          <h1 className="font-serif text-2xl mt-4 mb-1">Forgot Password</h1>
          <p className="text-sm text-brand-gray">
            {step === "email" ? "Enter your email to receive a reset code" : "Enter the code sent to your email"}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase block mb-1">6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="input-field text-center tracking-widest text-xl font-mono"
                placeholder="000000"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase block mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="input-field pr-10"
                  placeholder="At least 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors">
                  {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="input-field pr-10"
                  placeholder="Repeat password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors">
                  {showConfirm ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Updating..." : "Reset Password"}
            </button>
            <button type="button" onClick={() => setStep("email")} className="w-full text-xs text-brand-gray hover:text-brand-black text-center mt-1">
              ← Resend OTP
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-6 text-brand-gray">
          Remember your password?{" "}
          <Link href="/login" className="text-brand-black underline underline-offset-2 hover:text-brand-gold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
