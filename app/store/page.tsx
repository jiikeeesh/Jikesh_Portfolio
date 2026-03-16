"use client";

import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

// Note: Removed export const metadata as Client Components cannot export metadata.

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  colors: string;
  buttonText: string;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-8 text-center">Store</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 text-center">
          Discover digital products, templates, and services to enhance your projects.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${product.colors} flex items-center justify-center`}
                >
                  <span className="text-white text-4xl font-bold">
                    {product.icon}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                      {product.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}