import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
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
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white dark:from-black/20 dark:to-black"></div>
        </div>
        {/* Subtle Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[700px] md:h-[700px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-[80px] -z-20"></div>

        {/* Text Content */}
        <div className="max-w-3xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-400">
            Hi, I'm Jikesh
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            I'm a passionate Computer Science student. I enjoy creating beautiful websites, mastering programming languages, and exploring cutting-edge technologies.
          </p>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium">
            I build maintainable full-stack applications and produce professional visual media. From writing scalable code to editing polished video, I focus on delivering a complete digital experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
              Get in Touch
            </a>
            <a href="/store" className="inline-block bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white font-bold py-4 px-10 rounded-xl transition-all">
              Visit Store
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
