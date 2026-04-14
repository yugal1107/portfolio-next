"use client";

import { useEffect, useState } from "react";
import { getAdminMe, getAdminSettings, patchAdminSettings } from "@/lib/api/admin";
import Link from "next/link";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAdminMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminSettings().then((data) => {
        if (data && "fullName" in data) {
          setSettings(data as Record<string, string>);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const result = await patchAdminSettings(settings);
      if (result.success) {
        setMessage("Settings saved");
      } else {
        setMessage("Failed to save");
      }
    } catch {
      setMessage("Error saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-zinc-400">Loading...</div>;
  if (!isAuthenticated) return <div className="p-8 text-zinc-400">Please <Link href="/admin/login">login</Link> first.</div>;

  const fields = [
    { key: "fullName", label: "Full Name", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "bio", label: "Bio", type: "textarea" },
    { key: "location", label: "Location", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "githubUrl", label: "GitHub URL", type: "url" },
    { key: "linkedinUrl", label: "LinkedIn URL", type: "url" },
    { key: "twitterUrl", label: "Twitter URL", type: "url" },
    { key: "instagramUrl", label: "Instagram URL", type: "url" },
    { key: "resumeUrl", label: "Resume URL", type: "url" },
    { key: "profileImageUrl", label: "Profile Image URL", type: "url" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Link href="/admin" className="text-zinc-400 hover:text-zinc-200">← Back</Link>
      </header>
      <div className="max-w-2xl space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-zinc-400 mb-1">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                value={settings[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                value={settings[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        {message && <p className="text-zinc-400">{message}</p>}
      </div>
    </div>
  );
}