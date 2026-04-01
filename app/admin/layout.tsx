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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white pb-20">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">
              Jikesh
              <span className="text-gray-500 text-sm ml-2 font-normal">Admin</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/admin/manage-products"
                className={`text-sm font-medium hover:text-blue-600 transition ${
                  pathname === "/admin/manage-products" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Products
              </Link>
              <Link
                href="/admin/add-product"
                className={`text-sm font-medium hover:text-blue-600 transition ${
                  pathname === "/admin/add-product" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Add Product
              </Link>
              <Link
                href="/admin/messages"
                className={`text-sm font-medium hover:text-blue-600 transition ${
                  pathname === "/admin/messages" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Messages
              </Link>

              <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-2"></div>

              <Link
                href="/admin/manage-projects"
                className={`text-sm font-medium hover:text-blue-600 transition ${
                  pathname === "/admin/manage-projects" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Projects
              </Link>
              <Link
                href="/admin/add-project"
                className={`text-sm font-medium hover:text-blue-600 transition ${
                  pathname === "/admin/add-project" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Add Project
              </Link>
            </div>
          </div>

          {/* Right side: theme + logout + hamburger */}
          <div className="flex items-center gap-3 md:gap-5">
            <ThemeToggle />
            
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
            >
              {loggingOut ? "Logging out..." : "Logout →"}
            </button>

            {/* Hamburger – mobile only */}
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}

// ── Mobile hamburger dropdown ──────────────────────────────────────────────────
function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/admin/manage-products", label: "📦 Products" },
    { href: "/admin/add-product", label: "➕ Add Product" },
    { href: "/admin/messages", label: "💬 Messages" },
    { href: "/admin/manage-projects", label: "🗂 Projects" },
    { href: "/admin/add-project", label: "➕ Add Project" },
  ];

  return (
    <div className="relative md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        className="flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <span
          style={{
            display: "block",
            width: "20px",
            height: "2px",
            background: open ? "#6b7280" : "#374151",
            transform: open ? "translateY(7px) rotate(45deg)" : "none",
            transition: "transform 0.25s, background 0.2s",
          }}
        />
        <span
          style={{
            display: "block",
            width: "20px",
            height: "2px",
            background: "#374151",
            opacity: open ? 0 : 1,
            transition: "opacity 0.2s",
          }}
        />
        <span
          style={{
            display: "block",
            width: "20px",
            height: "2px",
            background: open ? "#6b7280" : "#374151",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            transition: "transform 0.25s, background 0.2s",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "44px",
            width: "210px",
            background: "var(--dropdown-bg, white)",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 999,
          }}
          className="dark:[--dropdown-bg:#111827] dark:border-gray-700"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              } ${i === 3 ? "border-t border-gray-200 dark:border-gray-700" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
