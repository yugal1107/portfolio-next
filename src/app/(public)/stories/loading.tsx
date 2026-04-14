"use client";

import { motion } from "motion/react";

export default function StoriesLoading() {
  return (
    <main className="relative z-10 min-h-screen pt-20">
      <section className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <motion.div 
              className="h-4 w-32 bg-surface-container-high rounded-full mb-4"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="h-12 w-48 bg-surface-container-highest rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div 
              key={i}
              className="group block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4">
                <motion.div 
                  className="w-full h-full bg-surface-container-high"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                />
              </div>
              <div className="space-y-2">
                <motion.div 
                  className="h-3 w-24 bg-surface-container-high rounded-full"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.05 }}
                />
                <motion.div 
                  className="h-6 w-3/4 bg-surface-container-highest rounded-lg"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}