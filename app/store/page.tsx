import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Store - Jikesh",
  description: "Browse and purchase digital products and services.",
};

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-8 text-center">Store</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 text-center">
          Discover digital products, templates, and services to enhance your projects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">🎨</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Modern Web Template</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Professional responsive template perfect for portfolios and businesses.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$49</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">📱</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Mobile App UI Kit</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Complete UI components for iOS and Android app development.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$79</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">🚀</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">React Components Pack</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                50+ reusable React components with TypeScript support.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$99</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Product 4 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">📚</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Web Development Course</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Complete course covering HTML, CSS, JavaScript, and React.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$149</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Product 5 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">🎯</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">SEO Optimization Service</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Professional SEO audit and optimization for your website.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$199</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Product 6 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">💼</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Consultation Package</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                1-hour personalized consultation for your web development needs.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$89</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}