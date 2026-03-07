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
            <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-blue-600 dark:border-blue-400">
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
          <div>
            <h1 className="text-5xl font-bold mb-6">Hi, I'm Jikesh</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Hello! I'm Jikesh Lo Tamang, a passionate Computer Science student. I enjoy creating beautiful websites, mastering programming languages, and exploring cutting-edge technologies.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              My job is to build your website so that it is functional and user-friendly but at the same time attractive. Moreover, I add personal touch to your product and make sure that is eye-catching and easy to use. My mission is to develop innovative projects and continuously grow as a tech enthusiast.
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
