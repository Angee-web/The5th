"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "08054257675";
  const message = encodeURIComponent("Hi! I need help with my order on 5thJohnson.");

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 text-black bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  );
}
