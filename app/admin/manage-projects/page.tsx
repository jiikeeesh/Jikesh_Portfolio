"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects?all=true");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleVisibility = async (id: number, currentVisible: boolean) => {
    setToggleLoading(id);
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visible: !currentVisible }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      setProjects(projects.map((p) => p.id === id ? { ...p, visible: !currentVisible } : p));
    } catch (err: any) {
      alert(err.message || "Failed to toggle visibility");
    } finally {
      setToggleLoading(null);
    }
  };

  const visibleCount = projects.filter((p) => p.visible !== false).length;
  const hiddenCount = projects.length - visibleCount;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Manage Projects
            </h1>
            <p className="mt-2 text-[var(--text-secondary)]">
              View, show, hide, and manage your portfolio projects.
            </p>
          </div>
          <Link
            href="/admin/add-project"
            className="neu-btn-accent px-6 py-3 rounded-xl font-semibold text-sm"
          >
            + Add New
          </Link>
        </div>

        {/* Stats row */}
        {!loading && projects.length > 0 && (
          <div className="flex gap-4 mb-6">
            <div className="neu-flat rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {visibleCount} Visible
            </div>
            <div className="neu-flat rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
              {hiddenCount} Hidden
            </div>
          </div>
        )}

        {/* Table card */}
        <div className="neu-raised rounded-2xl overflow-hidden">
          {error && (
            <div className="p-4 neu-inset m-4 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-[var(--text-muted)]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mb-4" />
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)]">
              <p className="mb-4">No projects found. Add your first project!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs tracking-wider text-[var(--text-muted)] uppercase">
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Categories</th>
                    <th className="p-4 font-semibold">Tech</th>
                    <th className="p-4 font-semibold">Links</th>
                    <th className="p-4 font-semibold text-center">Visible</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const isVisible = project.visible !== false;
                    return (
                      <tr
                        key={project.id}
                        className={`border-b border-[var(--border)] transition-all duration-200 ${
                          isVisible ? "hover:bg-[var(--surface)]" : "opacity-50 hover:opacity-70"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {!isVisible && (
                              <span className="text-xs px-2 py-0.5 neu-flat rounded-full text-[var(--text-muted)] font-medium">
                                Hidden
                              </span>
                            )}
                            <div>
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-[var(--text-muted)] truncate max-w-xs">
                                {project.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Categories */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {(project.categories && project.categories.length > 0
                              ? project.categories
                              : project.category ? [project.category] : ["code"]
                            ).map((cat) => (
                              <span
                                key={cat}
                                className={`text-xs px-2 py-1 rounded-full font-medium neu-flat ${
                                  cat === "code"     ? "text-blue-600 dark:text-blue-400"    :
                                  cat === "creative" ? "text-purple-600 dark:text-purple-400" :
                                  cat === "mobile"   ? "text-green-600 dark:text-green-400"   :
                                  cat === "backend"  ? "text-orange-600 dark:text-orange-400" :
                                  cat === "ai"       ? "text-pink-600 dark:text-pink-400"     :
                                  "text-[var(--text-secondary)]"
                                }`}
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Tech */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {project.tech.slice(0, 3).map((t, i) => (
                              <span key={i} className="text-xs px-2 py-1 neu-flat rounded-lg text-[var(--text-secondary)]">
                                {t}
                              </span>
                            ))}
                            {project.tech.length > 3 && (
                              <span className="text-xs px-2 py-1 neu-flat rounded-lg text-[var(--text-muted)]">
                                +{project.tech.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Links */}
                        <td className="p-4 text-sm">
                          <div className="flex flex-col gap-1">
                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                              className="text-[var(--accent)] hover:underline">Site</a>
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                              className="text-[var(--text-muted)] hover:underline">GitHub</a>
                          </div>
                        </td>

                        {/* Visibility Toggle */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleVisibility(project.id, isVisible)}
                            disabled={toggleLoading === project.id}
                            title={isVisible ? "Click to hide" : "Click to show"}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none neu-inset ${
                              toggleLoading === project.id ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full shadow-md transition-transform duration-300 ${
                              isVisible
                                ? "translate-x-6 bg-[var(--accent)]"
                                : "translate-x-1 bg-[var(--text-muted)]"
                            }`} />
                          </button>
                          <p className="text-xs mt-1 text-[var(--text-muted)]">
                            {toggleLoading === project.id ? "Saving..." : isVisible ? "Shown" : "Hidden"}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/edit-project/${project.id}`}
                              className="px-4 py-2 text-sm font-medium text-[var(--accent)] neu-flat rounded-lg transition-all duration-200 hover:shadow-none"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(project.id)}
                              disabled={deleteLoading === project.id}
                              className="px-4 py-2 text-sm font-medium text-red-500 neu-flat rounded-lg transition-all duration-200"
                            >
                              {deleteLoading === project.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
