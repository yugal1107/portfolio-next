"use client";

import { useEffect, useState } from "react";
import { getAdminMe, getAdminProjects, createAdminProject, updateAdminProject, deleteAdminProject } from "@/lib/api/admin";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  techStack: string[];
  featured: boolean;
  orderIndex: number;
  isPublished: boolean;
}

const emptyProject = {
  title: "",
  slug: "",
  description: "",
  liveUrl: "",
  githubUrl: "",
  imageUrl: "",
  techStack: [] as string[],
  featured: false,
  orderIndex: 0,
  isPublished: true,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<typeof emptyProject>(emptyProject);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAdminMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminProjects().then((data) => {
        if (Array.isArray(data)) setProjects(data);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    setMessage("");
    try {
      const payload = { ...form, techStack: form.techStack.filter(Boolean) };
      const result = editingId
        ? await updateAdminProject(editingId, payload)
        : await createAdminProject(payload);
      if (result.success) {
        setMessage(editingId ? "Updated" : "Created");
        setForm(emptyProject);
        setEditingId(null);
        getAdminProjects().then((data) => {
          if (Array.isArray(data)) setProjects(data);
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
      await deleteAdminProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setMessage("Delete failed");
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      imageUrl: project.imageUrl || "",
      techStack: project.techStack,
      featured: project.featured,
      orderIndex: project.orderIndex,
      isPublished: project.isPublished,
    });
    setEditingId(project.id);
  };

  if (isLoading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (!isAuthenticated) return <div className="p-8 text-zinc-400">Please <Link href="/admin/login">login</Link> first.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/admin" className="text-zinc-400 hover:text-zinc-200">← Back</Link>
      </header>
      <div className="max-w-4xl space-y-8">
        <section className="border border-zinc-700 rounded p-4 space-y-4">
          <h2 className="text-lg font-medium">{editingId ? "Edit Project" : "Add Project"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Slug (kebab-case)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 col-span-2"
            />
            <input
              placeholder="Live URL"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <input
              placeholder="Tech Stack (comma-separated)"
              value={form.techStack.join(", ")}
              onChange={(e) =>
                setForm({ ...form, techStack: e.target.value.split(",").map((s) => s.trim()) })
              }
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
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
          <button
            onClick={handleSubmit}
            className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {message && <span className="ml-2 text-zinc-400">{message}</span>}
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyProject);
              }}
              className="ml-2 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          )}
        </section>
        <section>
          <h2 className="text-lg font-medium mb-4">Existing Projects</h2>
          <div className="space-y-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="border border-zinc-700 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{p.title}</span>
                  <span className="text-zinc-500 text-sm ml-2">/ {p.slug}</span>
                  <span
                    className={`text-xs ml-2 ${
                      p.isPublished ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {p.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-zinc-400 hover:text-zinc-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-zinc-500">No projects yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}