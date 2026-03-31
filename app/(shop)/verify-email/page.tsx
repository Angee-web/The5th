"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { HiCheckCircle } from "react-icons/hi2";

function VerifyEmailForm() {
  const params = useSearchParams();
  const emailParam = params.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setLoading(true);

    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase(), otp }),
    });
    const data = await res.json();

    if (res.ok) {
      setVerified(true);
    } else {
      toast.error(data.error);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { toast.error("Enter your email first"); return; }
    setResending(true);
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase() }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.error);
    }
    setResending(false);
  };

  if (verified) {
    return (
      <div className="text-center">
        <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl mb-2">Email Verified!</h1>
        <p className="text-brand-gray text-sm mb-8">
          Your account is active. You can now sign in.
        </p>
        <Link href="/login" className="btn-primary inline-block">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-1 text-center">Verify Your Email</h1>
      <p className="text-brand-gray text-sm text-center mb-8">
        Enter the 6-digit code we sent to your email address.
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
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
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Verification Code</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            className="input-field text-center text-2xl tracking-[0.5em] font-mono"
            placeholder="000000"
            autoFocus
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-xs text-brand-gray">Didn&apos;t receive a code?</p>
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-brand-black underline underline-offset-2 hover:text-brand-gold disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend code"}
        </button>
      </div>

      <p className="text-xs text-center mt-6 text-brand-gray">
        Already verified?{" "}
        <Link href="/login" className="text-brand-black underline underline-offset-2 hover:text-brand-gold">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold">
            5thJohnson<span className="text-brand-gold">.</span>
          </Link>
        </div>
        <Suspense>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
