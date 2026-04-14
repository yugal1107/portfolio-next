"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdminMe, logoutAdmin } from "@/lib/api/admin";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/contact", label: "Messages" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

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

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = "/admin/login";
  };

  if (isLoading && !isLoginRoute) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (isLoginRoute) {
    return children;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Please login to access admin area</p>
          <Link
            href="/admin/login"
            className="inline-block px-4 py-2 bg-zinc-100 text-black rounded hover:bg-zinc-200 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="text-xl font-semibold text-zinc-100 font-headline"
              >
                Admin
              </Link>
              <nav className="hidden md:flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive(item.href, item.exact)
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500">{username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
