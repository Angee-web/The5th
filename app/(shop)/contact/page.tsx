"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { HiEnvelope, HiMapPin } from "react-icons/hi2";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <p className="section-subtitle">We'd Love to Hear From You</p>
        <h1 className="section-title">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <h2 className="font-serif text-2xl mb-6">Get In Touch</h2>
          <p className="text-brand-gray leading-relaxed mb-8">
            Have a question about your order, sizing, or just want to say hi? We're always here. Reach out through any channel and our team will respond as quickly as possible.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-cream flex items-center justify-center flex-shrink-0">
                <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-medium text-sm">WhatsApp</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="text-sm text-brand-gray hover:text-brand-black transition-colors"
                >
                  Chat with us directly
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-cream flex items-center justify-center flex-shrink-0">
                <HiEnvelope className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="font-medium text-sm">Email</p>
                <a href="mailto:hello@5thjohnson.com" className="text-sm text-brand-gray hover:text-brand-black transition-colors">
                darhareochuko@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-cream flex items-center justify-center flex-shrink-0">
                <FaInstagram className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Instagram</p>
                <a href="https://instagram.com/5thjohnson" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-gray hover:text-brand-black transition-colors">
                  @5thjohnson
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-cream flex items-center justify-center flex-shrink-0">
                <HiMapPin className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="font-medium text-sm">Location</p>
                <p className="text-sm text-brand-gray">Delta, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest uppercase block mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase block mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input-field" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">Subject</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="input-field" placeholder="How can we help?" />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase block mb-1">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={6}
              className="input-field resize-none"
              placeholder="Tell us more..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
