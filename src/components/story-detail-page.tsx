/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, MapPin, Code2, ExternalLink, CheckCircle2, Trophy, Users, Link as LinkIcon } from "lucide-react";

import { resolveImageUrl } from "@/lib/cloudinary";
import type { StoryDetail } from "@/types/content";

type StoryDetailPageProps = {
  story: StoryDetail;
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

export function StoryDetailPage({ story }: StoryDetailPageProps) {
  const markdownParagraphs = story.contentMarkdown
    ? story.contentMarkdown.split(/\n\n+/).filter(Boolean)
    : [];

  const heroImage = story.images?.[0] || story.cardImageUrl;
  const heroPublicId = story.imagePublicIds?.[0] || story.cardImagePublicId;
  const galleryImages = story.images?.slice(1) || [];

  return (
    <main className="relative z-10 min-h-screen pt-32 px-6 md:px-12 pb-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-16"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="space-y-8 text-center">
          <div className="flex justify-center">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-bold uppercase tracking-widest text-sm bg-primary/10 px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Stories
            </Link>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-on-surface">
              {story.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-outline-variant uppercase tracking-widest">
              {story.dateText && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> {story.dateText}
                </span>
              )}
              {story.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" /> {story.location}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Featured Image */}
          {heroImage && (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden group shadow-2xl shadow-black/50 border border-outline-variant/20">
              <img
                src={resolveImageUrl(heroImage, heroPublicId, "storyHero")}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}

          {/* Remaining Images Grid */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {galleryImages.map((image, index) => {
                const publicId = story.imagePublicIds?.[index + 1];
                return (
                  <div
                    key={`${story.slug}-img-${index}`}
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl group shadow-lg border border-outline-variant/10"
                  >
                    <img
                      src={resolveImageUrl(image, publicId, "storyGallery")}
                      alt={`${story.title} visual ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Story Description */}
        <motion.div variants={itemVariants} className="space-y-6 text-on-surface-variant">
          {markdownParagraphs.map((paragraph, index) => (
            <p key={`${story.slug}-paragraph-${index + 1}`} className="text-lg md:text-xl leading-relaxed font-body">
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Project Details */}
        {story.project && typeof story.project === "object" && (
          <motion.div variants={itemVariants} className="relative group rounded-3xl overflow-hidden border border-primary/20 bg-[#0a0f1a] shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            <div className="relative p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-headline font-bold text-on-surface">
                  Project: {(story.project as Record<string, unknown>).name as string || "Untitled"}
                </h2>
              </div>

              {(story.project as Record<string, unknown>).techStack ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {(((story.project as Record<string, unknown>).techStack) as string[]).map((tech, index) => (
                    <span
                      key={index}
                      className="bg-surface-bright border border-outline-variant/20 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-on-surface"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}

              {(story.project as Record<string, unknown>).description ? (
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                  {(story.project as Record<string, unknown>).description as string}
                </p>
              ) : null}

              {(story.project as Record<string, unknown>).github ? (
                <a
                  href={(story.project as Record<string, unknown>).github as string}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-md font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
                >
                  <ExternalLink className="w-5 h-5" /> View Source Code
                </a>
              ) : null}
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Key Outcomes */}
          {story.outcomes && story.outcomes.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
                <Trophy className="w-6 h-6 text-secondary" />
                <h2 className="text-3xl font-headline font-bold tracking-tighter text-on-surface">
                  Key Outcomes
                </h2>
              </div>
              <ul className="space-y-4">
                {story.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-3 text-on-surface-variant">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Team Details */}
          {story.team && typeof story.team === "object" && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
                <Users className="w-6 h-6 text-tertiary" />
                <h2 className="text-3xl font-headline font-bold tracking-tighter text-on-surface">
                  Team: {(story.team as Record<string, unknown>).name as string || "Team"}
                </h2>
              </div>
              {(story.team as Record<string, unknown>).members ? (
                <div className="grid gap-4">
                  {((story.team as Record<string, unknown>).members as Array<{ name: string; role: string; LinkedIn?: string }>).map((member, index) => (
                    <div
                      key={index}
                      className="bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/10 hover:border-primary/30 transition-colors rounded-xl p-4 flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-sm text-outline-variant uppercase tracking-wider font-medium mt-1">
                          {member.role}
                        </p>
                      </div>
                      {member.LinkedIn ? (
                        <a
                          href={member.LinkedIn}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-outline hover:text-secondary transition-colors p-2"
                        >
                          <LinkIcon className="w-5 h-5" />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}