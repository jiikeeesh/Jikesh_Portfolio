"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { value: "code", label: "Code & Logic", emoji: "💻" },
  { value: "creative", label: "Design & Visuals", emoji: "🎨" },
  { value: "mobile", label: "Mobile App", emoji: "📱" },
  { value: "backend", label: "Backend / API", emoji: "⚙️" },
  { value: "ai", label: "AI / ML", emoji: "🤖" },
  { value: "opensource", label: "Open Source", emoji: "🌐" },
];

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  categories?: string[];
  category?: string; // legacy field
  visible?: boolean;
}

export default function EditProjectPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Project>({
    id: 0,
    title: "",
    description: "",
    tech: [],
    link: "",
    github: "",
    categories: ["code"],
    visible: true,
  });

  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/projects?all=true");
        if (!res.ok) throw new Error("Failed to fetch project");
        const projects = await res.json();
        const project = projects.find(
          (p: Project) => p.id === parseInt(params.id)
        );

        if (!project) {
          setError("Project not found");
          return;
        }

        // Normalise: if legacy 'category' string exists but no 'categories' array
        const categories =
          project.categories && project.categories.length > 0
            ? project.categories
            : project.category
            ? [project.category]
            : ["code"];

        setFormData({ ...project, categories });
        setTechInput(project.tech.join(", "));
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const toggleCategory = (value: string) => {
    setFormData((prev) => {
      const current = prev.categories || ["code"];
      const already = current.includes(value);
      if (already) {
        if (current.length === 1) return prev; // keep at least one
        return { ...prev, categories: current.filter((c) => c !== value) };
      } else {
        return { ...prev, categories: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    try {
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tech: techArray,
          categories: formData.categories || ["code"],
        }),
      });

      if (!res.ok) throw new Error("Failed to update project");

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/manage-projects");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const selectedCategories = formData.categories || ["code"];

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin/manage-projects"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Management
          </Link>
          <h1 className="text-3xl font-bold">Edit Project</h1>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Project updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. My Awesome Project"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Briefly describe the project..."
              />
            </div>

            {/* Tech */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Technologies{" "}
                <span className="text-gray-400 font-normal">(comma separated)</span>
              </label>
              <input
                type="text"
                required
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. React, Next.js, Tailwind CSS"
              />
            </div>

            {/* Categories — multi-select pill checkboxes */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categories{" "}
                <span className="text-gray-400 font-normal">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = selectedCategories.includes(cat.value);
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
                Selected:{" "}
                {selectedCategories
                  .map((c) => CATEGORIES.find((cat) => cat.value === c)?.label)
                  .join(", ")}
              </p>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Live Demo URL</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving Changes..." : "Save Project"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
