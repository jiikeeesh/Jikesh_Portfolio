"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject");

  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Pre-fill the message with the subject if provided in the URL
  useEffect(() => {
    if (initialSubject) {
      setFormData((prev) => ({
        ...prev,
        message: `Hi Jikesh,\n\nI am contacting you regarding: ${initialSubject}.\n\n`,
      }));
    }
  }, [initialSubject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('Message sent successfully.');
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      setStatus('Error sending message.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-8 text-center">Send me a Message</h3>
      <form className="space-y-6" id="contact-form" onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Your message here..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
        >
          Send Message
        </button>
      </form>
      <p id="form-status" className="mt-4 text-center">{status}</p>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold mb-4 text-center">Get In Touch</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">
            I'd love to hear from you. Feel free to reach out via email or connect on social media!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Email</h4>
                  <a href="mailto:jiikeeeshphotography@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                    jiikeeeshphotography@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Phone</h4>
                  <a href="tel:+9779843674315" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                    +977 984 367 4315
                  </a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">Kathmandu, Nepal</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
              <div className="space-y-4">
                <div className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">jiikeeeshphotography@gmail.com</p>
                  </div>
                <div className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-2">GitHub</h4>
                  <p className="text-gray-600 dark:text-gray-400">github.com/jiikeeesh</p>
                </div>
                <div className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Instagram</h4>
                  <p className="text-gray-600 dark:text-gray-400">@jiikeeesh</p>
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="text-center py-10">Loading Contact Form...</div>}>
            <ContactFormContent />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}
