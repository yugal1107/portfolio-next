"use client";

import { useEffect, useState } from "react";
import { getAdminMe, getAdminStories, createAdminStory, deleteAdminStory } from "@/lib/api/admin";
import Link from "next/link";

interface Story {
  id: number;
  title: string;
  slug: string;
  dateText: string | null;
  location: string | null;
  status: string | null;
  cardImageUrl: string | null;
  orderIndex: number;
  isPublished: boolean;
}

const emptyStory = {
  title: "",
  slug: "",
  dateText: "",
  location: "",
  status: "",
  cardImageUrl: "",
  contentMarkdown: "",
  orderIndex: 0,
  isPublished: true,
};

export default function StoriesAdminPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<typeof emptyStory>(emptyStory);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAdminMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminStories().then((data) => {
        if (Array.isArray(data)) setStories(data);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    setMessage("");
    try {
      const payload = {
        ...form,
        dateText: form.dateText || null,
        location: form.location || null,
        status: form.status || null,
        cardImageUrl: form.cardImageUrl || null,
        images: [],
        imagePublicIds: [],
        outcomes: [],
      };
      const result = await createAdminStory(payload);
      if (result.success) {
        setMessage("Created");
        setForm(emptyStory);
        getAdminStories().then((data) => {
          if (Array.isArray(data)) setStories(data);
        });
      } else {
        setMessage("Failed");
      }
    } catch {
      setMessage("Error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteAdminStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setMessage("Delete failed");
    }
  };

  if (isLoading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (!isAuthenticated) return <div className="p-8 text-zinc-400">Please <Link href="/admin/login">login</Link> first.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stories</h1>
        <Link href="/admin" className="text-zinc-400 hover:text-zinc-200">← Back</Link>
      </header>
      <div className="max-w-4xl space-y-8">
        <section className="border border-zinc-700 rounded p-4 space-y-4">
          <h2 className="text-lg font-medium">Add Story</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Date (e.g. Jan 2024)"
              value={form.dateText}
              onChange={(e) => setForm({ ...form, dateText: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Status (e.g. Published)"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Card Image URL"
              value={form.cardImageUrl}
              onChange={(e) => setForm({ ...form, cardImageUrl: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <textarea
              placeholder="Content (Markdown)"
              value={form.contentMarkdown}
              onChange={(e) => setForm({ ...form, contentMarkdown: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 col-span-2"
              rows={6}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              Published
            </label>
            <input
              type="number"
              placeholder="Order"
              value={form.orderIndex}
              onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
          </div>
          <button onClick={handleSubmit} className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700">
            Create
          </button>
          {message && <span className="ml-2 text-zinc-400">{message}</span>}
        </section>
        <section>
          <h2 className="text-lg font-medium mb-4">Existing Stories</h2>
          <div className="space-y-2">
            {stories.map((s) => (
              <div
                key={s.id}
                className="border border-zinc-700 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{s.title}</span>
                  <span className="text-zinc-500 text-sm ml-2">/ {s.slug}</span>
                  {s.dateText && <span className="text-zinc-500 text-sm ml-2">{s.dateText}</span>}
                  <span
                    className={`text-xs ml-2 ${
                      s.isPublished ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {s.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
            {stories.length === 0 && <p className="text-zinc-500">No stories yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}