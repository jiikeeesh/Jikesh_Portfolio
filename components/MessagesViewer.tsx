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
        setMessages(prev => prev.filter(m => m.timestamp !== ts));
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
    return <p>No messages yet.</p>;
  }

  return (
    <div className="space-y-8">
      {messages.map((msg, idx) => (
        <div key={idx} className="border p-4 rounded-lg relative">
          <button
            disabled={loading}
            onClick={() => deleteMessage(msg.timestamp)}
            className="absolute top-2 right-2 text-red-500 hover:opacity-75"
            aria-label="Delete message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h1v9a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 3a1 1 0 012 0v9a1 1 0 11-2 0V5zm4-1a1 1 0 112 0v9a1 1 0 11-2 0V4z" clipRule="evenodd" />
            </svg>
          </button>
          <p><strong>Name:</strong> {msg.name}</p>
          <p><strong>Email:</strong> {msg.email}</p>
          <p><strong>Time:</strong> {new Date(msg.timestamp).toLocaleString()}</p>
          <p className="mt-2 whitespace-pre-wrap">{msg.message}</p>
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}