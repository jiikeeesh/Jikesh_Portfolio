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
  category?: string; // legacy
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
      // Use ?all=true so admin sees hidden projects too
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

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

      setProjects(
        projects.map((p) =>
          p.id === id ? { ...p, visible: !currentVisible } : p
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to toggle visibility");
    } finally {
      setToggleLoading(null);
    }
  };

  const visibleCount = projects.filter((p) => p.visible !== false).length;
  const hiddenCount = projects.length - visibleCount;

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white">
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Manage Projects
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View, show, hide, and manage your portfolio projects.
            </p>
          </div>
          <Link
            href="/admin/add-project"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-md"
          >
            + Add New Project
          </Link>
        </div>

        {/* Stats bar */}
        {!loading && projects.length > 0 && (
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm font-medium text-green-700 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {visibleCount} Visible
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
              {hiddenCount} Hidden
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="mb-4">No projects found. Add your first project!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-sm tracking-wider text-gray-600 dark:text-gray-400">
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Categories</th>
                    <th className="p-4 font-semibold">Technologies</th>
                    <th className="p-4 font-semibold">Links</th>
                    <th className="p-4 font-semibold text-center">Visibility</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {projects.map((project) => {
                    const isVisible = project.visible !== false;
                    return (
                      <tr
                        key={project.id}
                        className={`transition ${
                          isVisible
                            ? "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            : "opacity-50 hover:opacity-70 bg-gray-50/50 dark:bg-gray-900/50"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {!isVisible && (
                              <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                                Hidden
                              </span>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {project.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {project.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Categories column */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {(project.categories && project.categories.length > 0
                              ? project.categories
                              : project.category
                              ? [project.category]
                              : ['code']
                            ).map((cat) => (
                              <span
                                key={cat}
                                className={`text-xs px-2 py-1 rounded-full font-medium border ${
                                  cat === 'code' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700' :
                                  cat === 'creative' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700' :
                                  cat === 'mobile' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700' :
                                  cat === 'backend' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700' :
                                  cat === 'ai' ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700' :
                                  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {project.tech.slice(0, 3).map((t, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300"
                              >
                                {t}
                              </span>
                            ))}
                            {project.tech.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                                +{project.tech.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex flex-col gap-1">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Site
                            </a>
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:underline"
                            >
                              Source
                            </a>
                          </div>
                        </td>

                        {/* Visibility Toggle */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              handleToggleVisibility(project.id, isVisible)
                            }
                            disabled={toggleLoading === project.id}
                            title={isVisible ? "Click to hide" : "Click to show"}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              toggleLoading === project.id
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            } ${
                              isVisible
                                ? "bg-blue-600"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                isVisible ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            {toggleLoading === project.id
                              ? "Saving..."
                              : isVisible
                              ? "Shown"
                              : "Hidden"}
                          </p>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/edit-project/${project.id}`}
                              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(project.id)}
                              disabled={deleteLoading === project.id}
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition"
                            >
                              {deleteLoading === project.id
                                ? "Deleting..."
                                : "Delete"}
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
