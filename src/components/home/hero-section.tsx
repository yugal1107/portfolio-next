"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Download, Github, Linkedin } from "lucide-react";
import type { SiteSettings } from "@/types/content";

type HeroSectionProps = {
  settings: SiteSettings | null;
};

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto pt-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="text-tertiary font-headline font-medium tracking-[0.2em] uppercase text-sm block">
              {settings?.title || "Full Stack & GenAI Enthusiast"}
            </span>
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-tight">
              YUGAL<br/><span className="text-primary">BURDE.</span>
            </h1>
          </div>
          <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
            {settings?.bio || "Architecting intelligent digital ecosystems with a focus on performance, scalability, and agentic AI systems."}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a 
              href={settings?.resumeUrl || "#"} 
              target={settings?.resumeUrl ? "_blank" : undefined}
              rel={settings?.resumeUrl ? "noreferrer" : undefined}
              className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-4 rounded-md font-bold font-headline flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
            >
              Download CV
              <Download className="w-5 h-5" />
            </a>
            <div className="flex gap-4">
              <a href={settings?.githubUrl || "https://github.com/yugal1107"} target="_blank" rel="noreferrer" className="bg-surface-bright border border-outline-variant/20 p-4 rounded-md hover:bg-surface-variant transition-all">
                <Github className="w-6 h-6" />
              </a>
              <a href={settings?.linkedinUrl || "https://www.linkedin.com/in/yugal-burde-58012a256/"} target="_blank" rel="noreferrer" className="bg-surface-bright border border-outline-variant/20 p-4 rounded-md hover:bg-surface-variant transition-all">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all"></div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-container-high border border-outline-variant/10">
            <Image 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              src={settings?.profileImageUrl || "https://www.yugal.live/profile.png"} 
              alt={settings?.fullName || "Yugal Burde"}
              fill
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}