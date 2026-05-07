"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Calendar, ArrowRight, Tag } from "lucide-react";

import type { BlogPostCard } from "@/types/content";

/* eslint-disable @next/next/no-img-element */
import { resolveImageUrl } from "@/lib/cloudinary";

type BlogPageProps = {
  blogPosts: BlogPostCard[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

export function BlogPage({ blogPosts }: BlogPageProps) {
  const sortedPosts = [...blogPosts].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <main className="relative z-10 min-h-screen pt-20">
      <section className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-sm font-headline font-medium tracking-[0.4em] uppercase text-outline mb-4">Technical Writing</h2>
            <h3 className="text-5xl font-headline font-bold tracking-tighter">Blog</h3>
          </div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sortedPosts.map((post) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-6 shadow-lg border border-outline-variant/10">
                  {post.coverImageUrl ? (
                    <img
                      src={resolveImageUrl(post.coverImageUrl, post.coverImagePublicId, "storyHero")}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                      <span className="text-outline-variant font-headline text-6xl font-bold opacity-20">BLOG</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-outline-variant">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-headline font-bold tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  
                  {post.summary && (
                    <p className="text-on-surface-variant line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  )}
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-surface-container-low border border-outline-variant/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-on-surface"
                        >
                          <Tag className="w-3 h-3 text-primary" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm pt-2">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
