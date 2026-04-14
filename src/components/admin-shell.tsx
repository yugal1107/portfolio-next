"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  deleteAdminContactMessage,
  getAdminContactMessages,
  getAdminMe,
  loginAdmin,
  logoutAdmin,
  updateAdminContactMessageStatus,
} from "@/lib/api/admin";
import type { ContactMessage, ContactMessageStatus } from "@/types/content";

export function AdminShell() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [loginUsername, setLoginUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [me, contactMessages] = await Promise.all([getAdminMe(), getAdminContactMessages()]);
        setUsername(me.username);
        setIsAuthenticated(true);
        setMessages(contactMessages);
      } catch {
        setIsAuthenticated(false);
        setError("");
      } finally {
        setAuthChecked(true);
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleStatusChange = async (id: number, status: ContactMessageStatus) => {
    try {
      await updateAdminContactMessageStatus(id, status);
      setMessages((current) => current.map((msg) => (msg.id === id ? { ...msg, status } : msg)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminContactMessage(id);
      setMessages((current) => current.filter((msg) => msg.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete message");
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");
      await loginAdmin({ username: loginUsername, password });

      const [me, contactMessages] = await Promise.all([getAdminMe(), getAdminContactMessages()]);
      setUsername(me.username);
      setMessages(contactMessages);
      setIsAuthenticated(true);
      setPassword("");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setIsAuthenticated(false);
      setUsername("");
      setMessages([]);
      setError("");
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Logout failed");
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold">Admin</h1>
          <p className="text-zinc-400">Integration-first admin shell for migration testing.</p>
          {username ? <p className="text-sm text-zinc-500">Signed in as {username}</p> : null}
        </header>

        {isLoading ? <p className="text-zinc-300">Loading admin data...</p> : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        {!isLoading && authChecked && !isAuthenticated ? (
          <section className="max-w-md rounded border border-zinc-800 bg-zinc-950 p-4">
            <h2 className="mb-3 text-lg font-medium">Admin Login</h2>
            <form className="space-y-3" onSubmit={handleLogin}>
              <input
                type="text"
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                placeholder="Admin username"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                placeholder="Admin password"
                required
              />
              <button
                type="submit"
                className="rounded border border-zinc-700 px-3 py-2 text-sm hover:border-zinc-500"
              >
                Login
              </button>
            </form>
          </section>
        ) : null}

        {!isLoading && isAuthenticated ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-medium">Contact Messages ({messages.length})</h2>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded border border-zinc-700 px-3 py-1 text-xs hover:border-zinc-500"
              >
                Logout
              </button>
            </div>

            {messages.length === 0 ? <p className="text-zinc-400">No contact messages yet.</p> : null}

            <div className="space-y-3">
              {messages.map((message) => (
                <article key={message.id} className="rounded border border-zinc-800 bg-zinc-950 p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{message.name}</p>
                      <p className="text-sm text-zinc-400">{message.email}</p>
                    </div>
                    <span className="rounded border border-zinc-700 px-2 py-1 text-xs uppercase text-zinc-300">
                      {message.status}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-zinc-300">{message.message}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(message.id, "new")}
                      className="rounded border border-zinc-700 px-2 py-1 hover:border-zinc-500"
                    >
                      Mark New
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(message.id, "read")}
                      className="rounded border border-zinc-700 px-2 py-1 hover:border-zinc-500"
                    >
                      Mark Read
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(message.id, "archived")}
                      className="rounded border border-zinc-700 px-2 py-1 hover:border-zinc-500"
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(message.id)}
                      className="rounded border border-red-700 px-2 py-1 text-red-300 hover:border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
