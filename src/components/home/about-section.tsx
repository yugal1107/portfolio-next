"use client";

import { motion } from "motion/react";
import { Code2, Cpu, Database } from "lucide-react";
import type { SiteSettings } from "@/types/content";

type AboutSectionProps = {
  settings: SiteSettings | null;
};

export function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto bg-surface-container-low rounded-3xl my-20">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-6">
            <h2 className="text-4xl font-headline font-bold text-on-surface">The Vision</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {settings?.bio || "I am a Computer Science Engineering student at MITS Gwalior with a deep focus on full-stack development and Generative AI. I build scalable backend APIs and RAG-based AI assistants that solve real-world problems."}
            </p>
            <div className="flex gap-12 py-8">
              <div>
                <span className="block text-4xl font-headline font-bold text-primary">8.46</span>
                <span className="text-sm uppercase tracking-widest text-outline">Current GPA</span>
              </div>
              <div>
                <span className="block text-4xl font-headline font-bold text-tertiary">300+</span>
                <span className="text-sm uppercase tracking-widest text-outline">LeetCode</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-12">
          <h3 className="text-2xl font-headline font-bold text-primary">Core Expertise</h3>
          <div className="grid gap-6">
            {[
              { icon: <Code2 />, title: "Full Stack Development", desc: "Building end-to-end applications with modern frameworks like React, Next.js, and Node.js." },
              { icon: <Cpu />, title: "Generative AI & RAG", desc: "Engineering agentic AI workflows and RAG pipelines using LangChain, LangGraph, and Gemini." },
              { icon: <Database />, title: "Backend Architecture", desc: "Designing robust APIs and managing relational/NoSQL databases with high efficiency." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="glass-card p-8 rounded-xl border border-outline-variant/10 hover:bg-surface-variant/80 transition-colors flex gap-6"
              >
                <div className="text-primary">{item.icon}</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-on-surface-variant">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}