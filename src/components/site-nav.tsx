"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";

export function SiteNav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-20">
        <Link href="/" className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tighter text-primary font-headline">YUGAL.LIVE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-headline text-sm uppercase tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <Link href="/stories" className="hover:text-primary transition-colors">Stories</Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link 
            href="/#contact"
            className="bg-primary text-on-primary px-6 py-2 rounded-md font-bold font-headline text-xs uppercase tracking-wider hover:scale-105 transition-transform"
          >
            Hire Me
          </Link>
        </div>
      </div>
    </header>
  );
}