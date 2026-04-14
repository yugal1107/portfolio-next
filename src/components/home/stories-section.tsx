"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/cloudinary";
import Link from "next/link";
import type { StoryCard } from "@/types/content";

type StoriesSectionProps = {
  stories: StoryCard[];
};

const storyVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
    filter: "blur(8px)"
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)"
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 1.05,
    filter: "blur(8px)"
  })
};

export function StoriesSection({ stories }: StoriesSectionProps) {
  const sortedStories = [...stories].sort((a, b) => a.orderIndex - b.orderIndex);
  const [currentStory, setCurrentStory] = useState(0);
  const [storyDirection, setStoryDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const paginateStory = useCallback((newDirection: number) => {
    setStoryDirection(newDirection);
    setCurrentStory((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = sortedStories.length - 1;
      if (next >= sortedStories.length) next = 0;
      return next;
    });
  }, [sortedStories.length]);

  useEffect(() => {
    if (isHovered || sortedStories.length === 0) return;
    const timer = setInterval(() => {
      paginateStory(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentStory, isHovered, sortedStories.length, paginateStory]);

  if (sortedStories.length === 0) {
    return null;
  }

  const currentStoryData = sortedStories[currentStory];
  const imageUrl = resolveImageUrl(currentStoryData.cardImageUrl, currentStoryData.cardImagePublicId, "storyCard");

  return (
    <section id="stories" className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-sm font-headline font-medium tracking-[0.4em] uppercase text-outline mb-4">Experiences</h2>
          <h3 className="text-5xl font-headline font-bold tracking-tighter">My Stories</h3>
        </div>
      </div>
      
      <div 
        className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden group bg-surface-container-highest shadow-2xl shadow-black/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={storyDirection}>
          <motion.div
            key={currentStory}
            custom={storyDirection}
            variants={storyVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Link href={`/story/${currentStoryData.slug}`} className="absolute inset-0 w-full h-full block">
              <div className="absolute inset-0 z-0">
                <Image 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                  src={imageUrl || "https://picsum.photos/seed/story/1200/800"}
                  alt={currentStoryData.title}
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-16 space-y-4">
                <div className="flex flex-wrap gap-4 text-xs md:text-sm font-bold text-white/80 uppercase tracking-widest mb-2">
                  {currentStoryData.dateText && (
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {currentStoryData.dateText}</span>
                  )}
                  {currentStoryData.location && (
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-tertiary" /> {currentStoryData.location}</span>
                  )}
                </div>
                <h4 className="text-4xl md:text-5xl font-headline font-bold text-white group-hover:text-primary transition-colors duration-300">{currentStoryData.title}</h4>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {sortedStories.length > 1 && (
          <>
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 hover:scale-110"
              onClick={(e) => { e.preventDefault(); paginateStory(-1); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 hover:scale-110"
              onClick={(e) => { e.preventDefault(); paginateStory(1); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-8 right-8 md:right-16 z-20 flex gap-3">
              {sortedStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setStoryDirection(idx > currentStory ? 1 : -1);
                    setCurrentStory(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentStory 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}