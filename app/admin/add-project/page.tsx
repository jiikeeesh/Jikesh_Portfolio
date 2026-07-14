"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "code",       label: "Code & Logic",      emoji: "💻" },
  { value: "creative",   label: "Design & Visuals",  emoji: "🎨" },
  { value: "mobile",     label: "Mobile App",         emoji: "📱" },
  { value: "backend",    label: "Backend / API",      emoji: "⚙️" },
  { value: "ai",         label: "AI / ML",            emoji: "🤖" },
  { value: "opensource", label: "Open Source",        emoji: "🌐" },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl neu-inset text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--background)]";

const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-2";

export default function AddProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech: "",
    link: "",
    github: "",
    categories: ["code"] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (value: string) => {
    setFormData((prev) => {
      const already = prev.categories.includes(value);
      if (already) {
        if (prev.categories.length === 1) return prev;
        return { ...prev, categories: prev.categories.filter((c) => c !== value) };
      } else {
        return { ...prev, categories: [...prev.categories, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const techArray = formData.tech.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: formData.title,
        description: formData.description,
        tech: techArray,
        link: formData.link || "#",
        github: formData.github || "#",
        categories: formData.categories,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add project");

      setSuccess(true);
      setFormData({ title: "", description: "", tech: "", link: "", github: "", categories: ["code"] });
      setTimeout(() => { router.push("/admin/manage-projects"); router.refresh(); }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="neu-raised rounded-2xl overflow-hidden">

          {/* Card header */}
          <div className="px-8 py-6 border-b border-[var(--border)]">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Add New Project
            </h1>
            <p className="mt-1 text-[var(--text-secondary)]">
              Showcase a new piece of work on your portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {success && (
              <div className="p-4 neu-inset rounded-xl text-green-500 text-sm flex items-center gap-2">
                ✅ Project added successfully! Redirecting...
              </div>
            )}
            {error && (
              <div className="p-4 neu-inset rounded-xl text-red-500 text-sm flex items-center gap-2">
                ❌ {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className={labelClass}>Project Title</label>
              <input type="text" id="title" name="title" required
                value={formData.title} onChange={handleChange}
                className={inputClass} placeholder="e.g. E-Commerce Platform" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea id="description" name="description" required rows={3}
                value={formData.description} onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Brief summary of the project..." />
            </div>

            {/* Tech */}
            <div>
              <label htmlFor="tech" className={labelClass}>
                Technologies Used <span className="text-[var(--text-muted)] font-normal">(comma separated)</span>
              </label>
              <input type="text" id="tech" name="tech" required
                value={formData.tech} onChange={handleChange}
                className={inputClass} placeholder="e.g. React, Next.js, Tailwind CSS" />
              <p className="text-xs text-[var(--text-muted)] mt-1">Separate each technology with a comma.</p>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className={labelClass}>
                Categories <span className="text-[var(--text-muted)] font-normal">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = formData.categories.includes(cat.value);
                  return (
                    <button key={cat.value} type="button" onClick={() => toggleCategory(cat.value)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none ${
                        selected
                          ? "neu-inset text-[var(--accent)]"
                          : "neu-flat text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}>
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                      {selected && <span className="ml-0.5 text-[var(--accent)]">✓</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Selected: {formData.categories.map((c) => CATEGORIES.find((cat) => cat.value === c)?.label).join(", ")}
              </p>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="link" className={labelClass}>
                  Live URL <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                </label>
                <input type="url" id="link" name="link"
                  value={formData.link} onChange={handleChange}
                  className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label htmlFor="github" className={labelClass}>
                  GitHub URL <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                </label>
                <input type="url" id="github" name="github"
                  value={formData.github} onChange={handleChange}
                  className={inputClass} placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 ${
                  loading ? "neu-flat opacity-50 cursor-not-allowed text-[var(--text-muted)]" : "neu-btn-accent"
                }`}>
                {loading ? "Saving Project..." : "Add Project"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
