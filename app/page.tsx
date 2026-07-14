import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center overflow-hidden">
        {/* Profile Image as Background Element */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-15 dark:opacity-20 grayscale brightness-75">
            <Image
              src="/jikesh.png"
              alt="Jikesh background"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Subtle Color Overlay to improve text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/20 to-[var(--background)]"></div>
        </div>
        {/* Subtle Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[700px] md:h-[700px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-[80px] -z-20"></div>

        {/* Text Content */}
        <div className="max-w-3xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)]">
            Hi, I&apos;m Jikesh
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 leading-relaxed">
            A Computer Science student bridging the gap between logic and design.
          </p>
          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 leading-relaxed font-medium">
            I build scalable, maintainable full-stack applications and craft polished visual media to deliver seamless, end-to-end digital experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="neu-btn-accent font-bold py-4 px-10 rounded-xl"
            >
              Get in Touch
            </a>
            <a
              href="/projects"
              className="neu-btn-secondary font-bold py-4 px-10 rounded-xl"
            >
              Show Projects
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
