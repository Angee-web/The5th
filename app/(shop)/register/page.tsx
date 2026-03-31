"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } else {
      toast.error(data.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-bold">
            5thJohnson<span className="text-brand-gold">.</span>
          </Link>
          <h1 className="font-serif text-2xl mt-4 mb-1">Create Account</h1>
          <p className="text-sm text-brand-gray">Join the 5thJohnson family</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 border border-brand-gray-light py-3 text-sm hover:bg-brand-cream transition-colors mb-6"
        >
          <FaGoogle className="w-4 h-4 text-red-500" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-brand-gray-light" />
          <span className="text-xs text-brand-gray">or</span>
          <div className="flex-1 h-px bg-brand-gray-light" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input-field"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                className="input-field pr-10"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
                className="input-field pr-10"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-brand-gray">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-black underline underline-offset-2 hover:text-brand-gold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
