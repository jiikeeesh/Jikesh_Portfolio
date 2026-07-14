"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/about",    label: "About"    },
  { href: "/projects", label: "Projects" },
  { href: "/contact",  label: "Contact"  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  /** True when the current path matches or is nested under `href` */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/*
       * Spacer — keeps page content below the fixed island.
       * Height matches island (~56px) + top gap (16px) + breathing room.
       */}
      <div className="h-24" aria-hidden="true" />

      {/* ── Fixed wrapper — invisible, no pointer events ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
        <div className="relative w-full max-w-2xl pointer-events-auto">

          {/* ① THE ISLAND ──────────────────────────────────────────── */}
          <nav className="neu-nav-island flex items-center gap-1 px-4 py-3">

            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold tracking-tight mr-3 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-200 shrink-0"
            >
              Jikesh
            </Link>

            {/* ── Desktop links ── */}
            <div className="hidden md:flex gap-1 flex-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium ${
                    isActive(href)
                      /* ④ CONCAVE INSET — "You Are Here" */
                      ? "neu-nav-link-active text-[var(--accent)]"
                      /* ② RESTING FLAT + ③ CONVEX LIFT on hover */
                      : "neu-nav-link text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Spacer pushes CTA to right on mobile */}
            <div className="flex-1 md:hidden" />

            {/* ⑤ RAISED PILL CTA — desktop */}
            <Link
              href="/contact"
              className="hidden md:inline-block neu-nav-cta px-5 py-2 text-sm"
            >
              Hire Me
            </Link>

            {/* ── Mobile hamburger (neu-icon-btn) ── */}
            <button
              className="md:hidden neu-icon-btn p-2 rounded-xl"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation"
              aria-expanded={isOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </nav>
          {/* ──────────────────────────────────────────────────────── */}

          {/* ── Mobile dropdown — second island beneath the first ── */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 neu-nav-island p-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block px-4 py-3 text-base font-medium rounded-xl ${
                    isActive(href)
                      ? "neu-nav-link-active text-[var(--accent)]"
                      : "neu-nav-link text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}

              {/* ⑤ RAISED PILL CTA — mobile */}
              <Link
                href="/contact"
                className="neu-nav-cta block px-5 py-3 text-base text-center mt-1 rounded-2xl"
                onClick={() => setIsOpen(false)}
              >
                Hire Me
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
