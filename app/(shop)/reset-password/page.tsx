"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (!token) { toast.error("Invalid reset link"); return; }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
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

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-brand-gray mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="btn-primary inline-block">Request New Link</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors"
          >
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
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors"
          >
            {showConfirm ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold">
            5thJohnson<span className="text-brand-gold">.</span>
          </Link>
          <h1 className="font-serif text-2xl mt-4 mb-1">Reset Password</h1>
          <p className="text-sm text-brand-gray">Enter your new password below</p>
        </div>
        <Suspense fallback={<p className="text-center text-sm text-brand-gray">Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
