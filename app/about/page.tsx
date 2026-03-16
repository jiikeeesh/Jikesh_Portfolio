import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8">About Me</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          I'm a passionate web developer with expertise in modern technologies like React, Next.js, and TypeScript. I love building responsive and user-friendly applications that solve real-world problems.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          I build maintainable full-stack applications and produce professional visual media. From writing scalable code to editing polished video, I focus on delivering a complete digital experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Skills</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                React & Next.js
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                Web Design
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                Node.js
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                Photography & Videography
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Experience</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                5+ years experience
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Full-stack development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                UI/UX focused development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Team collaboration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Project management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Client communication
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
