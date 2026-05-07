/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Tag, Twitter, Linkedin, Share2, Clock } from "lucide-react";

import type { BlogPostDetail } from "@/types/content";

import { resolveImageUrl } from "@/lib/cloudinary";
import { MarkdownRenderer } from "@/components/markdown-renderer";

type BlogDetailPageProps = {
  blogPost: BlogPostDetail;
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

export function BlogDetailPage({ blogPost }: BlogDetailPageProps) {
  const shareUrl = `https://yugal.live/blog/${blogPost.slug}`;
  const shareText = `Check out this article: ${blogPost.title}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const wordCount = blogPost.contentMarkdown.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="relative z-10 min-h-screen pt-32 px-6 md:px-12 pb-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto space-y-12 md:space-y-16"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
          <div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-outline-variant hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-on-surface leading-tight">
              {blogPost.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm font-bold text-outline-variant uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(blogPost.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {readingTime} min read
              </span>
            </div>
            {blogPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag) => (
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
          </div>
        </motion.div>

        {/* Cover Image */}
        {blogPost.coverImageUrl && (
          <motion.div variants={itemVariants} className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-outline-variant/20">
            <img
              src={resolveImageUrl(blogPost.coverImageUrl, blogPost.coverImagePublicId, "storyHero")}
              alt={blogPost.title}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div variants={itemVariants}>
          <MarkdownRenderer content={blogPost.contentMarkdown} />
        </motion.div>

        {/* Share Section */}
        <motion.div variants={itemVariants} className="border-t border-outline-variant/20 pt-12">
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-outline-variant flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share this article
            </h3>
            <div className="flex items-center gap-4">
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1da1f2] text-white px-6 py-3 rounded-md font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
              >
                <Twitter className="w-5 h-5" />
                Share on X
              </a>
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-6 py-3 rounded-md font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
              >
                <Linkedin className="w-5 h-5" />
                Share on LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
