"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a skeleton so layout doesn't shift
    return (
      <div className="flex items-center gap-3 opacity-0 pointer-events-none select-none" aria-hidden="true">
        <span className="text-sm font-medium">Theme</span>
        <div className="w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <div className="flex items-center gap-3">
      {/* Sun Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4 h-4 transition-all duration-300 ${isDark ? "text-gray-500 scale-90" : "text-amber-500 scale-110"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>

      {/* The Toggle Track */}
      <button
        id="theme-toggle"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggle}
        className={`
          relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full
          border-2 border-transparent
          transition-colors duration-300 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          focus-visible:ring-offset-white dark:focus-visible:ring-offset-black
          ${isDark
            ? "bg-indigo-600 hover:bg-indigo-500"
            : "bg-gray-300 hover:bg-gray-400"
          }
        `}
      >
        {/* The Sliding Thumb */}
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
            transform transition-transform duration-300 ease-in-out
            ${isDark ? "translate-x-7" : "translate-x-0"}
          `}
        />
      </button>

      {/* Moon Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4 h-4 transition-all duration-300 ${isDark ? "text-indigo-400 scale-110" : "text-gray-400 scale-90"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sr-only">
        {isDark ? "Dark mode" : "Light mode"}
      </span>
    </div>
  );
}
