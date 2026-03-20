"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  colors: string;
  buttonText: string;
}

export default function EditProductPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    image: "",
    colors: "from-blue-400 to-purple-600",
    buttonText: "View Details",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch product");
        const products = await res.json();
        const product = products.find((p: Product) => p.id === parseInt(params.id));
        
        if (!product) {
          setError("Product not found");
          return;
        }

        setFormData(product);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update product");

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/manage-products");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/admin/manage-products" className="text-blue-600 hover:underline mb-4 inline-block">
            &larr; Back to Management
          </Link>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Product updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Rare Hotwheels"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL (PNG/JPG)</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com/photo.png"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe the product..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Color Gradient (Tailwind classes)</label>
                <input
                  type="text"
                  required
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="from-blue-400 to-purple-600"
                />
              </div>
            </div>

            <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br ${formData.colors} shadow-lg`}>
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=Preview+Error';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold">Preview</p>
                <p className="text-xs text-gray-500">How the card icon will look</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving Changes..." : "Save Product"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
