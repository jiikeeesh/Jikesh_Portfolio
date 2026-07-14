"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Do not show the admin navbar on the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { href: "/admin/messages",        label: "💬 Messages"    },
    { href: "/admin/manage-projects", label: "🗂 Projects"    },
    { href: "/admin/add-project",     label: "➕ Add Project" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] pb-20">

      {/* ── Admin Top Nav ── */}
      <nav className="neu-surface sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center gap-4">

          {/* Logo */}
          <Link href="/" className="font-bold text-lg text-[var(--accent)] shrink-0">
            Jikesh
            <span className="text-[var(--text-muted)] text-sm ml-2 font-normal">Admin</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  pathname === href
                    ? "neu-nav-link-active text-[var(--accent)]"
                    : "neu-nav-link text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors duration-200"
            >
              {loggingOut ? "Logging out..." : "Logout →"}
            </button>
            <MobileMenu pathname={pathname} navLinks={navLinks} />
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}

// ── Mobile hamburger dropdown ─────────────────────────────────────────────────
function MobileMenu({
  pathname,
  navLinks,
}: {
  pathname: string;
  navLinks: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        className="neu-icon-btn p-2 rounded-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-52 neu-raised rounded-2xl p-2 z-50">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                pathname === href
                  ? "neu-nav-link-active text-[var(--accent)]"
                  : "neu-nav-link text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
