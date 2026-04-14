"use client";

import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/cloudinary";
import type { Project } from "@/types/content";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sortedProjects = [...projects].sort((a, b) => a.orderIndex - b.orderIndex);
  const featuredProjects = sortedProjects.slice(0, 4);

  return (
    <section id="work" className="py-32 bg-surface-container-low px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto rounded-3xl">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-sm font-headline font-medium tracking-[0.4em] uppercase text-outline mb-4">Portfolio</h2>
          <h3 className="text-5xl font-headline font-bold tracking-tighter">Featured Artifacts</h3>
        </div>
        <a 
          href="/projects"
          className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
        >
          View all projects <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProjects.map((project) => (
          <motion.div 
            key={project.id}
            whileHover={{ y: -10 }}
            className={`group relative block ${project.featured ? 'md:col-span-2' : ''}`}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/40 via-transparent to-secondary/40 rounded-3xl blur-md opacity-30 group-hover:opacity-70 transition-opacity duration-700"></div>
            
            <div className="relative h-full bg-surface-container-lowest/40 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/20 group-hover:border-primary/30 transition-all flex flex-col">
              <div className={`relative overflow-hidden rounded-xl mb-6 ${project.featured ? 'h-80' : 'h-48'}`}>
                {resolveImageUrl(project.imageUrl, project.imagePublicId, "projectCard") ? (
                  <Image 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src={resolveImageUrl(project.imageUrl, project.imagePublicId, "projectCard") || ""}
                    alt={project.title}
                    fill
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                    <span className="text-on-surface-variant">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-grow space-y-4">
                <h3 className={`${project.featured ? 'text-3xl' : 'text-2xl'} font-headline font-bold group-hover:text-primary transition-colors`}>{project.title}</h3>
                <p className="text-on-surface-variant text-sm line-clamp-2">{project.description}</p>
              </div>
              <div className="flex justify-between items-center pt-6 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="bg-surface-bright px-3 py-1 rounded text-[10px] font-medium uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-secondary transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-secondary transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 flex justify-center md:hidden">
        <a 
          href="/projects"
          className="bg-surface-bright border border-outline-variant/20 px-6 py-3 rounded-md text-primary font-bold flex items-center gap-2 hover:bg-surface-variant transition-all"
        >
          View all projects <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}