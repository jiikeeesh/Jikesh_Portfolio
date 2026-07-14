"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const from = searchParams.get("from") || "/admin/manage-projects";
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
      <Navigation />

      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md neu-raised rounded-2xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Admin Login
            </h1>
            <p className="mt-2 text-[var(--text-secondary)]">
              Sign in to access the control panel.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 neu-inset rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl neu-inset text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--background)]"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl neu-inset text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--background)]"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 mt-2 ${
                loading
                  ? "opacity-50 cursor-not-allowed neu-flat text-[var(--text-muted)]"
                  : "neu-btn-accent"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--background)]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
