import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <Navigation />

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8">About Me</h2>
        
        {/* Bio paragraphs — raised card */}
        <div className="neu-raised rounded-2xl p-8 mb-12 space-y-6">
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            I am a Computer Science student with a deep passion for engineering robust, scalable software. For me, development goes beyond simply making things work—it is about writing clean, maintainable code that can grow and adapt over time. Whether I am designing complex backend architectures or building interactive full-stack web applications, I take pride in applying foundational computer science principles to solve real-world problems efficiently and elegantly.
          </p>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            However, my work isn&apos;t strictly driven by logic; I also bring a strong creative eye to the table. With hands-on experience in digital design, polished video editing, and visual media production, I approach frontend development from an artist&apos;s perspective. This creative background gives me a unique advantage when crafting user interfaces. It allows me to build digital experiences that are not just technically sound beneath the surface, but visually stunning, highly intuitive, and engaging for the end user.
          </p>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            Based in Nepal, I am constantly inspired by the vibrant intersection of technology and art, and I am eager to bring this unique perspective to a broader stage. I am currently seeking software engineering internships, freelance full-stack projects, and creative collaborations where I can fully leverage my blend of code and design. If you are building something exciting and need a developer who cares as much about the user experience as the underlying codebase, I would love to connect.
          </p>
        </div>

        {/* Skills & Experience — two raised cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="neu-raised rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Skills</h3>
            <ul className="text-[var(--text-secondary)] space-y-4">
              {[
                "React & Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Web Design",
                "Node.js",
                "Photography & Videography",
              ].map((skill) => (
                <li key={skill} className="flex items-center gap-3">
                  <span className="neu-flat w-7 h-7 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0">
                    ✓
                  </span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className="neu-raised rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Experience</h3>
            <ul className="text-[var(--text-secondary)] space-y-4">
              {[
                "5+ years experience",
                "Full-stack development",
                "UI/UX focused development",
                "Team collaboration",
                "Project management",
                "Client communication",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="neu-flat w-7 h-7 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
