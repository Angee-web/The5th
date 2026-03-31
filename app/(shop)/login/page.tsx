"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      toast.success("Welcome back!");
      const session = await getSession();
      router.push(session?.user?.role === "admin" ? "/admin" : "/");
      router.refresh();
    } else {
      const msg = res?.error?.startsWith("Please verify")
        ? res.error
        : "Invalid email or password";
      toast.error(msg, { duration: 6000 });
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
          <h1 className="font-serif text-2xl mt-4 mb-1">Welcome Back</h1>
          <p className="text-sm text-brand-gray">Sign in to your account</p>
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
            <label className="text-xs tracking-widest uppercase block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pr-10"
                placeholder="••••••••"
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
          <div className="text-right -mt-2">
            <Link href="/forgot-password" className="text-xs text-brand-gray hover:text-brand-black underline underline-offset-2">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-brand-gray">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand-black underline underline-offset-2 hover:text-brand-gold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
