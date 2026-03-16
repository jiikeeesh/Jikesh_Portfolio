import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-600 dark:border-blue-400">
              <Image
                src="/profile.png"
                alt="Jikesh - Web Developer"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hi, I'm Jikesh</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              I'm a passionate Computer Science student. I enjoy creating beautiful websites, mastering programming languages, and exploring cutting-edge technologies.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              I build maintainable full-stack applications and produce professional visual media. From writing scalable code to editing polished video, I focus on delivering a complete digital experience.
            </p>
            <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
