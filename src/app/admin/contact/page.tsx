"use client";

import { useEffect, useState } from "react";
import {
  getAdminMe,
  getAdminContactMessages,
  updateAdminContactMessageStatus,
  deleteAdminContactMessage,
} from "@/lib/api/admin";
import Link from "next/link";
import type { ContactMessage, ContactMessageStatus } from "@/types/content";

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAdminMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminContactMessages().then((data) => {
        if (Array.isArray(data)) setMessages(data);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (id: number, status: ContactMessageStatus) => {
    try {
      await updateAdminContactMessageStatus(id, status);
      setMessages((current) =>
        current.map((msg) => (msg.id === id ? { ...msg, status } : msg))
      );
    } catch {
      setMessage("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete message?")) return;
    try {
      await deleteAdminContactMessage(id);
      setMessages((current) => current.filter((msg) => msg.id !== id));
    } catch {
      setMessage("Delete failed");
    }
  };

  if (isLoading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (!isAuthenticated) return <div className="p-8 text-zinc-400">Please <Link href="/admin/login">login</Link> first.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contact Messages</h1>
        <Link href="/admin" className="text-zinc-400 hover:text-zinc-200">← Back</Link>
      </header>
      <div className="max-w-4xl space-y-4">
        {message && <p className="text-red-400">{message}</p>}
        {messages.map((msg) => (
          <div key={msg.id} className="border border-zinc-700 rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium">{msg.name}</span>
                <span className="text-zinc-400 text-sm ml-2">{msg.email}</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  msg.status === "new"
                    ? "bg-blue-900 text-blue-300"
                    : msg.status === "read"
                    ? "bg-zinc-700 text-zinc-300"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {msg.status}
              </span>
            </div>
            <p className="text-zinc-300 text-sm mb-3">{msg.message}</p>
            <div className="flex gap-2">
              {(["new", "read", "archived"] as ContactMessageStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(msg.id, s)}
                  className={`text-xs px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500 ${
                    msg.status === s ? "bg-zinc-700" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-xs px-2 py-1 rounded border border-red-700 text-red-400 hover:border-red-500"
              >
                Delete
              </button>
            </div>
            <p className="text-zinc-500 text-xs mt-2">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-zinc-500">No messages.</p>}
      </div>
    </div>
  );
}