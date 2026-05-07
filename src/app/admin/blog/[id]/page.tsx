"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminMe, getAdminBlogPost, updateAdminBlogPost, uploadAdminFile } from "@/lib/api/admin";
import Image from "next/image";
import Link from "next/link";

export default function BlogPostEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    contentMarkdown: "",
    tags: "",
    coverImageUrl: "",
    coverImagePublicId: "",
    orderIndex: 0,
    isPublished: false,
  });
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
    if (isAuthenticated && id) {
      getAdminBlogPost(id).then((data) => {
        setForm({
          title: data.title,
          slug: data.slug,
          summary: data.summary || "",
          contentMarkdown: data.contentMarkdown,
          tags: data.tags.join(", "),
          coverImageUrl: data.coverImageUrl || "",
          coverImagePublicId: data.coverImagePublicId || "",
          orderIndex: data.orderIndex,
          isPublished: data.isPublished,
        });
      }).catch(() => {
        setMessage("Failed to load blog post");
      });
    }
  }, [isAuthenticated, id]);

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
      const result = await updateAdminBlogPost(id, payload);
      if (result.success) {
        setMessage("Updated");
      } else {
        setMessage("Failed");
      }
    } catch {
      setMessage("Error");
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
        <h1 className="text-2xl font-semibold">Edit Blog Post</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/blog")} className="text-zinc-400 hover:text-zinc-200">← Back</button>
        </div>
      </header>
      <div className="max-w-4xl space-y-8">
        <section className="border border-zinc-700 rounded p-4 space-y-4">
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
              rows={16}
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
            Update
          </button>
          {message && <span className="ml-2 text-zinc-400">{message}</span>}
        </section>
      </div>
    </div>
  );
}
