"use client";

import { motion } from "motion/react";

export default function StoryLoading() {
  return (
    <main className="relative z-10 min-h-screen pt-32 px-6 md:px-12 pb-32">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="space-y-8 text-center">
          <motion.div 
            className="inline-flex items-center gap-2 h-10 w-40 bg-surface-container-high rounded-full mx-auto"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="space-y-6">
            <motion.div 
              className="h-16 md:h-20 w-3/4 bg-surface-container-highest rounded-lg mx-auto"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div 
              className="h-6 w-48 bg-surface-container-high rounded-full mx-auto"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </div>
        </div>

        {/* Hero Image */}
        <motion.div 
          className="w-full h-64 md:h-96 rounded-3xl bg-surface-container-high overflow-hidden"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Content Skeleton */}
        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4">
              <motion.div 
                className="h-6 w-1/4 bg-surface-container-highest rounded-lg"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 + i * 0.1 }}
              />
              <motion.div 
                className="h-4 w-full bg-surface-container-high rounded-full"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 + i * 0.1 + 0.05 }}
              />
              <motion.div 
                className="h-4 w-full bg-surface-container-high rounded-full"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 + i * 0.1 + 0.1 }}
              />
              <motion.div 
                className="h-4 w-3/4 bg-surface-container-high rounded-full"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 + i * 0.1 + 0.15 }}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}