"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user.name || "");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      await update({ name });
      toast.success("Profile updated!");
    } else {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setChangingPassword(true);
    const res = await fetch("/api/user/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(data.error || "Failed to update password");
    }
    setChangingPassword(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl mb-8">My Profile</h1>

      <div className="flex items-center gap-4 mb-8 p-6 bg-brand-cream">
        {session?.user.image ? (
          <Image src={session.user.image} alt="Avatar" width={64} height={64} className="rounded-full" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-black text-white flex items-center justify-center font-serif text-2xl">
            {session?.user.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium">{session?.user.name}</p>
          <p className="text-sm text-brand-gray">{session?.user.email}</p>
          {session?.user.role === "admin" && <span className="text-xs text-brand-gold">Admin</span>}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 mb-10">
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Display Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Email</label>
          <input value={session?.user.email || ""} readOnly className="input-field bg-brand-cream cursor-not-allowed" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="border-t border-brand-gray-light pt-8 mb-10">
        <h2 className="font-serif text-xl mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors">
                {showCurrent ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="input-field pr-10"
                placeholder="At least 8 characters"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors">
                {showNew ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field pr-10"
                placeholder="Repeat new password"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors">
                {showConfirm ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={changingPassword} className="btn-primary">
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="border-t border-brand-gray-light pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/orders" className="block border border-brand-gray-light p-4 hover:border-brand-black transition-colors">
          <p className="font-medium text-sm">My Orders</p>
          <p className="text-xs text-brand-gray mt-1">Track and manage your orders</p>
        </Link>
        <Link href="/wishlist" className="block border border-brand-gray-light p-4 hover:border-brand-black transition-colors">
          <p className="font-medium text-sm">Wishlist</p>
          <p className="text-xs text-brand-gray mt-1">Your saved favourites</p>
        </Link>
      </div>
    </div>
  );
}
