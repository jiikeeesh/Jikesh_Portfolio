"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">
              Jikesh
              <span className="text-gray-500 text-sm ml-2 font-normal">Admin</span>
            </Link>

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

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
          >
            {loggingOut ? "Logging out..." : "Logout →"}
          </button>
        </div>
      </nav>

      {/* Since the page itself renders Navigation and Footer, we want to hide them inside the admin area so we don't end up with duplicate navbars. We achieve this by overriding standard page Nav/Footer within admin pages if desired. Actually, since each page currently wraps itself in Navigation/Footer manually, they will appear below our admin bar. We should strip standard navs from admin pages for a cleaner look. */}
      {/* However, to avoid refactoring every admin page right now, we will simply stack this admin nav on top, or they can co-exist. */}
      {children}
    </div>
  );
}
