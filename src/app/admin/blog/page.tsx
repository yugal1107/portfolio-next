"use client";

import { useEffect, useRef, useState } from "react";
import { getAdminMe, getAdminBlogPosts, createAdminBlogPost, deleteAdminBlogPost, uploadAdminFile } from "@/lib/api/admin";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  coverImageUrl: string | null;
  orderIndex: number;
  isPublished: boolean;
}

const emptyBlogPost = {
  title: "",
  slug: "",
  summary: "",
  contentMarkdown: "",
  tags: "",
  coverImageUrl: "",
  coverImagePublicId: "",
  orderIndex: 0,
  isPublished: false,
};

export default function BlogAdminPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<typeof emptyBlogPost>(emptyBlogPost);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAdminMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminBlogPosts().then((data) => {
        if (Array.isArray(data)) setBlogPosts(data);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    setMessage("");
    try {
      const payload = {
        ...form,
        summary: form.summary || null,
        coverImageUrl: form.coverImageUrl || null,
        coverImagePublicId: form.coverImagePublicId || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const result = await createAdminBlogPost(payload);
      if (result.success) {
        setMessage("Created");
        setForm(emptyBlogPost);
        getAdminBlogPosts().then((data) => {
          if (Array.isArray(data)) setBlogPosts(data);
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
      await deleteAdminBlogPost(id);
      setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setMessage("Delete failed");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setMessage("");
    try {
      const data = await uploadAdminFile(file, { folder: "portfolio/blog", publicIdPrefix: "cover" });
      setForm((prev) => ({
        ...prev,
        coverImageUrl: data.url,
        coverImagePublicId: data.publicId,
      }));
      setMessage("Image uploaded");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, coverImageUrl: "", coverImagePublicId: "" }));
  };

  if (isLoading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (!isAuthenticated) return <div className="p-8 text-zinc-400">Please <Link href="/admin/login">login</Link> first.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href="/admin" className="text-zinc-400 hover:text-zinc-200">← Back</Link>
      </header>
      <div className="max-w-4xl space-y-8">
        <section className="border border-zinc-700 rounded p-4 space-y-4">
          <h2 className="text-lg font-medium">Add Blog Post</h2>
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
            <div className="col-span-2 space-y-2">
              <label className="block text-sm text-zinc-400">Cover Image</label>
              {form.coverImageUrl ? (
                <div className="flex items-center gap-4">
                  <Image src={form.coverImageUrl} alt="Cover preview" width={120} height={80} className="rounded border border-zinc-700 object-cover" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 truncate max-w-[200px]">{form.coverImagePublicId}</span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="text-sm text-zinc-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 disabled:opacity-50"
                  />
                  {isUploading && <span className="text-sm text-zinc-400">Uploading...</span>}
                </div>
              )}
            </div>
            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 col-span-2"
            />
            <textarea
              placeholder="Summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 col-span-2"
              rows={3}
            />
            <textarea
              placeholder="Content (Markdown)"
              value={form.contentMarkdown}
              onChange={(e) => setForm({ ...form, contentMarkdown: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 col-span-2"
              rows={10}
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
          <h2 className="text-lg font-medium mb-4">Existing Blog Posts</h2>
          <div className="space-y-2">
            {blogPosts.map((p) => (
              <div
                key={p.id}
                className="border border-zinc-700 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <Link href={`/admin/blog/${p.id}`} className="font-medium hover:text-primary">
                    {p.title}
                  </Link>
                  <span className="text-zinc-500 text-sm ml-2">/ {p.slug}</span>
                  <span
                    className={`text-xs ml-2 ${
                      p.isPublished ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {p.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
            {blogPosts.length === 0 && <p className="text-zinc-500">No blog posts yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
