import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8">About Me</h2>
        <div className="space-y-6 mb-12">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            I am a Computer Science student with a deep passion for engineering robust, scalable software. For me, development goes beyond simply making things work—it is about writing clean, maintainable code that can grow and adapt over time. Whether I am designing complex backend architectures or building interactive full-stack web applications, I take pride in applying foundational computer science principles to solve real-world problems efficiently and elegantly.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            However, my work isn't strictly driven by logic; I also bring a strong creative eye to the table. With hands-on experience in digital design, polished video editing, and visual media production, I approach frontend development from an artist's perspective. This creative background gives me a unique advantage when crafting user interfaces. It allows me to build digital experiences that are not just technically sound beneath the surface, but visually stunning, highly intuitive, and engaging for the end user.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Based in Nepal, I am constantly inspired by the vibrant intersection of technology and art, and I am eager to bring this unique perspective to a broader stage. I am currently seeking software engineering internships, freelance full-stack projects, and creative collaborations where I can fully leverage my blend of code and design. If you are building something exciting and need a developer who cares as much about the user experience as the underlying codebase, I would love to connect.
          </p>
        </div>

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
