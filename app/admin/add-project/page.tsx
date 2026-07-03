"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "code", label: "Code & Logic", emoji: "💻" },
  { value: "creative", label: "Design & Visuals", emoji: "🎨" },
  { value: "mobile", label: "Mobile App", emoji: "📱" },
  { value: "backend", label: "Backend / API", emoji: "⚙️" },
  { value: "ai", label: "AI / ML", emoji: "🤖" },
  { value: "opensource", label: "Open Source", emoji: "🌐" },
];

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (value: string) => {
    setFormData((prev) => {
      const already = prev.categories.includes(value);
      if (already) {
        // Don't allow deselecting all
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
      const techArray = formData.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

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
      setFormData({
        title: "",
        description: "",
        tech: "",
        link: "",
        github: "",
        categories: ["code"],
      });

      setTimeout(() => {
        router.push("/admin/manage-projects");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Add New Project
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Showcase a new piece of work on your portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 flex items-center">
                <span className="mr-2">✅</span> Project added successfully! Redirecting...
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-center">
                <span className="mr-2">❌</span> {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. E-Commerce Platform"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Brief summary of the project..."
              />
            </div>

            {/* Tech */}
            <div className="space-y-2">
              <label htmlFor="tech" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Technologies Used <span className="text-gray-400 font-normal">(comma separated)</span>
              </label>
              <input
                type="text"
                id="tech"
                name="tech"
                required
                value={formData.tech}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. React, Next.js, Tailwind CSS"
              />
              <p className="text-xs text-gray-500">Separate each technology with a comma.</p>
            </div>

            {/* Categories — multi-select pill checkboxes */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categories <span className="text-gray-400 font-normal">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = formData.categories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 select-none ${
                        selected
                          ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                      {selected && <span className="ml-0.5">✓</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                Selected: {formData.categories.map((c) => CATEGORIES.find((cat) => cat.value === c)?.label).join(", ")}
              </p>
            </div>

            {/* Live URL + GitHub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Live URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1 transform"
                  }
                `}
              >
                {loading ? "Saving Project..." : "Add Project"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
