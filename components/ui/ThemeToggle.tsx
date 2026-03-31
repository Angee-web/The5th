"use client";

import { useEffect, useState } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) return <div className="w-5 h-5" />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-brand-gray-dark hover:text-brand-black dark:text-gray-400 dark:hover:text-white transition-colors"
    >
      {dark ? (
        <HiOutlineSun className="w-5 h-5" />
      ) : (
        <HiOutlineMoon className="w-5 h-5" />
      )}
    </button>
  );
}
