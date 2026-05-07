"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminMe } from "@/lib/api/admin";

export function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminMe()
      .then((me) => {
        setUsername(me.username);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="p-8 text-zinc-400">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-zinc-400">
        Please <a href="/admin/login" className="underline">login</a> first.
      </div>
    );
  }

  const navItems = [
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/skills", label: "Skills" },
    { href: "/admin/stories", label: "Stories" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/contact", label: "Contact Messages" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Admin Panel</h1>
        <p className="text-zinc-400 mt-2">Logged in as {username}</p>
      </header>
      <nav className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-zinc-700 rounded p-4 hover:border-zinc-500 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
