"use client";

import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  category?: 'code' | 'creative';
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'creative'>('code');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // For the sake of the new layout, we will classify projects.
  // Since the DB might not have 'category' yet, we fallback to checking tech/title.
  const codeProjects = projects.filter(p => p.category === 'code' || !p.category && !p.tech.includes('Design'));
  const creativeProjects = projects.filter(p => p.category === 'creative' || (!p.category && p.tech.includes('Design')));

  const displayedProjects = activeTab === 'code' ? codeProjects : creativeProjects;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navigation />

      <section className="max-w-5xl mx-auto px-6 py-20 min-h-[80vh]">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {activeTab === 'code' ? 'Digital Architecture' : 'Creative Canvas'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {activeTab === 'code'
              ? 'Building robust full-stack applications and interactive web experiences.'
              : 'Crafting custom visual designs, polished video edits, and compelling media.'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 dark:bg-gray-900 p-1 rounded-full inline-flex relative shadow-inner">
            <button
              onClick={() => setActiveTab('code')}
              className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'code' ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Code & Logic
            </button>
            <button
              onClick={() => setActiveTab('creative')}
              className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'creative' ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Design & Visuals
            </button>
            
            {/* Animated Pill Background */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black dark:bg-white rounded-full transition-transform duration-300 ease-out ${
                activeTab === 'code' ? 'translate-x-0' : 'translate-x-full'
              }`}
            ></div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedProjects.length > 0 ? (
              displayedProjects.map((project) => (
                <div key={project.id} className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Subtle Gradient Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <h3 className="text-2xl font-bold mb-3 relative z-10">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg relative z-10 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="mb-8 relative z-10">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 relative z-10 mt-auto">
                    {project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 text-lg flex items-center gap-1">
                        View Live ↗
                      </a>
                    )}
                    {project.github !== '#' && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 font-semibold hover:text-black dark:hover:text-white text-lg flex items-center gap-1">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                <p className="text-xl">No projects in this category yet.</p>
                <p className="mt-2 text-sm">Check back soon or switch tabs to view other work.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
