"use client";

import type { Project } from "@/types/content";
import { ProjectCard } from "./project-card";

type ProjectsPageProps = {
  projects: Project[];
};

export function ProjectsPage({ projects }: ProjectsPageProps) {
  const sortedProjects = [...projects].sort((a, b) => a.orderIndex - b.orderIndex);
  
  return (
    <main className="relative z-10 pt-20">
      <section className="py-32 bg-surface-container-low px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto rounded-3xl">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-sm font-headline font-medium tracking-[0.4em] uppercase text-outline mb-4">Portfolio</h2>
            <h3 className="text-5xl font-headline font-bold tracking-tighter">Featured Artifacts</h3>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} featured={project.featured} />
          ))}
        </div>
      </section>
    </main>
  );
}