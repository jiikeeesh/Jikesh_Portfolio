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
      <div className="neu-raised rounded-2xl p-8">
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
              className="w-full px-4 py-3 rounded-xl neu-inset text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--background)]"
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
              className="w-full px-4 py-3 rounded-xl neu-inset text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--background)]"
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
              className="w-full px-4 py-3 rounded-xl neu-inset text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--background)] resize-none"
            />
          </div>
          <button
            type="submit"
            className="neu-btn-accent w-full font-bold py-3 px-6 rounded-xl text-lg"
          >
            Send Message
          </button>
        </form>
        <p id="form-status" className="mt-4 text-center text-[var(--text-secondary)]">{status}</p>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold mb-4 text-center">Get In Touch</h2>
          <div className="max-w-3xl mx-auto text-lg text-[var(--text-secondary)] text-center mb-12 space-y-4">
            <p>
              Whether you are a recruiter looking for a dedicated full-stack engineer, or a client in need of a custom website and polished visual media, I would love to hear from you.
            </p>
            <p>
              I am currently open to full-time roles, freelance projects, and creative collaborations. Drop me an email below or connect with me on social media, and let&apos;s turn your vision into reality!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Contact Info */}
            <div className="neu-raised rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Email</h4>
                  <a href="mailto:jiikeeeshphotography@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline text-lg transition-colors duration-200">
                    jiikeeeshphotography@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Phone</h4>
                  <a href="tel:+9779843674315" className="text-blue-600 dark:text-blue-400 hover:underline text-lg transition-colors duration-200">
                    +977 984 367 4315
                  </a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Location</h4>
                  <p className="text-[var(--text-secondary)]">Kathmandu, Nepal</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="neu-raised rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
              <div className="space-y-4">
                <div className="neu-inset rounded-xl p-4">
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-[var(--text-secondary)]">jiikeeeshphotography@gmail.com</p>
                </div>
                <div className="neu-inset rounded-xl p-4">
                  <h4 className="font-semibold mb-1">GitHub</h4>
                  <p className="text-[var(--text-secondary)]">github.com/jiikeeesh</p>
                </div>
                <div className="neu-inset rounded-xl p-4">
                  <h4 className="font-semibold mb-1">Instagram</h4>
                  <p className="text-[var(--text-secondary)]">@jiikeeesh</p>
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
