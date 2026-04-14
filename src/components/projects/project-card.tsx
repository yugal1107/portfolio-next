"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { resolveImageUrl } from "@/lib/cloudinary";
import type { Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`group relative block ${featured ? 'md:col-span-2' : ''}`}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/40 via-transparent to-secondary/40 rounded-3xl blur-md opacity-30 group-hover:opacity-70 transition-opacity duration-700"></div>
      
      <div className="relative h-full bg-surface-container-lowest/40 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/20 group-hover:border-primary/30 transition-all flex flex-col">
        <div className={`relative overflow-hidden rounded-xl mb-6 ${featured ? 'h-80' : 'h-48'}`}>
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
          <h3 className={`${featured ? 'text-3xl' : 'text-2xl'} font-headline font-bold group-hover:text-primary transition-colors`}>{project.title}</h3>
          <p className="text-on-surface-variant text-sm line-clamp-2">{project.description}</p>
        </div>
        <div className="flex justify-between items-center pt-6 mt-auto">
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tag, j) => (
              <span key={j} className="bg-surface-bright px-3 py-1 rounded text-[10px] font-medium uppercase tracking-wider">
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
  );
}