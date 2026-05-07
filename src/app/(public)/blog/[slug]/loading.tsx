"use client";

import { motion } from "motion/react";

export default function BlogPostLoading() {
  return (
    <main className="relative z-10 min-h-screen pt-32 px-6 md:px-12 pb-32">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Skeleton */}
        <div className="space-y-8 text-center">
          <motion.div 
            className="h-8 w-40 bg-surface-container-high rounded-full mx-auto"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="h-16 md:h-24 w-3/4 bg-surface-container-highest rounded-lg mx-auto"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.div 
            className="h-4 w-48 bg-surface-container-high rounded-full mx-auto"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </div>

        {/* Cover Image Skeleton */}
        <motion.div 
          className="relative aspect-video w-full rounded-3xl overflow-hidden"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <div className="w-full h-full bg-surface-container-high" />
        </motion.div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {[60, 75, 85, 70, 90].map((width, i) => (
            <motion.div 
              key={i}
              className="h-4 bg-surface-container-high rounded-full"
              style={{ width: `${width}%` }}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
