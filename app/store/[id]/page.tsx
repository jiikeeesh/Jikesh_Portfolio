"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  colors: string;
  buttonText: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const products: Product[] = await res.json();
        
        // Find the specific product matching the ID parameter
        const found = products.find((p) => p.id === Number(id));
        
        if (found) {
          setProduct(found);
        } else {
          setError("Product not found");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
        <Navigation />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 dark:border-blue-400"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
        <Navigation />
        <main className="flex-grow flex flex-col justify-center items-center max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Oops!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{error || "Product not found"}</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            ← Back to Store
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      <Navigation />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-20 w-full">
        <button 
          onClick={() => router.back()}
          className="mb-8 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition flex items-center gap-2"
        >
          <span>←</span> Back to Store
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Product Hero Icon Container */}
          <div className={`aspect-square w-full rounded-2xl bg-gradient-to-br ${product.colors} flex flex-col items-center justify-center shadow-2xl overflow-hidden`}>
            <span className="text-9xl mb-4 drop-shadow-xl">{product.icon}</span>
          </div>

          {/* Product Details Block */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{product.name}</h1>
            
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
              ${product.price}
            </div>
            
            <div className="h-px w-full bg-gray-200 dark:bg-gray-800 my-8"></div>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {product.description}
            </p>
            
            <div className="pt-8">
              <Link
                href={`/contact?subject=Inquiry about ${encodeURIComponent(product.name)}`}
                className="inline-block w-full md:w-auto text-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all"
              >
                Contact Me About This
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
