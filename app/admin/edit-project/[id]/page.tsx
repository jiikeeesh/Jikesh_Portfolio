"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { value: "code",       label: "Code & Logic",      emoji: "💻" },
  { value: "creative",   label: "Design & Visuals",  emoji: "🎨" },
  { value: "mobile",     label: "Mobile App",         emoji: "📱" },
  { value: "backend",    label: "Backend / API",      emoji: "⚙️" },
  { value: "ai",         label: "AI / ML",            emoji: "🤖" },
  { value: "opensource", label: "Open Source",        emoji: "🌐" },
];

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  categories?: string[];
  category?: string;
  visible?: boolean;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl neu-inset text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--background)]";

const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-2";

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
    id: 0, title: "", description: "", tech: [],
    link: "", github: "", categories: ["code"], visible: true,
  });

  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/projects?all=true");
        if (!res.ok) throw new Error("Failed to fetch project");
        const projects = await res.json();
        const project = projects.find((p: Project) => p.id === parseInt(params.id));
        if (!project) { setError("Project not found"); return; }

        const categories =
          project.categories && project.categories.length > 0
            ? project.categories
            : project.category ? [project.category] : ["code"];

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
        if (current.length === 1) return prev;
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

    const techArray = techInput.split(",").map((t) => t.trim()).filter((t) => t !== "");

    try {
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tech: techArray, categories: formData.categories || ["code"] }),
      });
      if (!res.ok) throw new Error("Failed to update project");
      setSuccess(true);
      setTimeout(() => { router.push("/admin/manage-projects"); }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]" />
      </div>
    );
  }

  const selectedCategories = formData.categories || ["code"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <main className="max-w-3xl mx-auto px-6 py-12">

        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/manage-projects"
            className="neu-flat px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold">Edit Project</h1>
        </div>

        <div className="neu-raised rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 neu-inset rounded-xl text-red-500 text-sm">❌ {error}</div>
          )}
          {success && (
            <div className="mb-6 p-4 neu-inset rounded-xl text-green-500 text-sm">
              ✅ Project updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className={labelClass}>Project Title</label>
              <input type="text" required value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClass} placeholder="e.g. My Awesome Project" />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea required rows={4} value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${inputClass} resize-none`}
                placeholder="Briefly describe the project..." />
            </div>

            {/* Tech */}
            <div>
              <label className={labelClass}>
                Technologies <span className="text-[var(--text-muted)] font-normal">(comma separated)</span>
              </label>
              <input type="text" required value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className={inputClass} placeholder="e.g. React, Next.js, Tailwind CSS" />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className={labelClass}>
                Categories <span className="text-[var(--text-muted)] font-normal">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = selectedCategories.includes(cat.value);
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
                Selected: {selectedCategories.map((c) => CATEGORIES.find((cat) => cat.value === c)?.label).join(", ")}
              </p>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Live Demo URL</label>
                <input type="text" value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className={inputClass} placeholder="https://example.com" />
              </div>
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input type="text" value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className={inputClass} placeholder="https://github.com/..." />
              </div>
            </div>

            <button type="submit" disabled={saving}
              className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 ${
                saving ? "neu-flat opacity-50 cursor-not-allowed text-[var(--text-muted)]" : "neu-btn-accent"
              }`}>
              {saving ? "Saving Changes..." : "Save Project"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
