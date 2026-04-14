"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <main className="relative z-10 pt-20">
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text Skeleton */}
        <div className="space-y-8 z-10 w-full">
          <div className="space-y-4">
            <motion.div 
              className="h-4 md:h-6 w-32 bg-surface-container-high rounded-full overflow-hidden relative"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="space-y-2 md:space-y-4">
              {/* "YUGAL" Skeleton */}
              <motion.div 
                className="h-16 md:h-24 w-[65%] md:w-[55%] bg-surface-container-highest rounded-xl relative overflow-hidden"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
              {/* "BURDE." Skeleton */}
              <motion.div 
                className="h-16 md:h-24 w-[80%] md:w-[65%] bg-primary/20 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <motion.div 
              className="h-4 w-full bg-surface-container-high rounded-full relative overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.div 
              className="h-4 w-5/6 bg-surface-container-high rounded-full relative overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <motion.div 
              className="h-4 w-4/6 bg-surface-container-high rounded-full relative overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <motion.div 
              className="h-12 w-40 bg-surface-container-highest rounded-md relative overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            <motion.div 
              className="h-12 w-12 bg-surface-container-highest rounded-full relative overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            />
          </div>
        </div>

        {/* Right Side: Image Skeleton */}
        <motion.div 
          className="relative group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-container-high border border-outline-variant/10">
            <motion.div 
              className="w-full h-full bg-surface-container-highest"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
      </section>
    </main>
  );
}
