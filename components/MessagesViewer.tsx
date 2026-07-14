"use client";

import { useState } from "react";

interface Message {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

interface Props {
  initialMessages: Message[];
  secret?: string;
}

export default function MessagesViewer({ initialMessages, secret }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMessage = async (ts: string) => {
    setLoading(true);
    try {
      const url = `/api/messages${secret ? `?secret=${encodeURIComponent(secret)}` : ""}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: ts }),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.timestamp !== ts));
      } else {
        setError("Failed to delete message");
      }
    } catch (e) {
      console.error(e);
      setError("Error deleting message");
    } finally {
      setLoading(false);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="neu-inset rounded-2xl p-12 text-center text-[var(--text-muted)]">
        <p className="text-lg">No messages yet.</p>
        <p className="text-sm mt-1">Messages from the contact form will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg, idx) => (
        <div key={idx} className="neu-raised rounded-2xl p-6 relative group">
          {/* Delete button */}
          <button
            disabled={loading}
            onClick={() => deleteMessage(msg.timestamp)}
            className="absolute top-4 right-4 neu-icon-btn p-2 rounded-xl text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Delete message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h1v9a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 3a1 1 0 012 0v9a1 1 0 11-2 0V5zm4-1a1 1 0 112 0v9a1 1 0 11-2 0V4z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Sender info row */}
          <div className="flex flex-wrap gap-3 mb-4 pr-10">
            <span className="neu-flat rounded-full px-3 py-1 text-sm font-semibold text-[var(--text-primary)]">
              {msg.name}
            </span>
            <a href={`mailto:${msg.email}`}
              className="neu-flat rounded-full px-3 py-1 text-sm text-[var(--accent)] hover:underline">
              {msg.email}
            </a>
            <span className="neu-flat rounded-full px-3 py-1 text-xs text-[var(--text-muted)]">
              {new Date(msg.timestamp).toLocaleString()}
            </span>
          </div>

          {/* Message body */}
          <div className="neu-inset rounded-xl p-4">
            <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed text-sm">
              {msg.message}
            </p>
          </div>
        </div>
      ))}

      {error && (
        <div className="neu-inset rounded-xl p-4 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}