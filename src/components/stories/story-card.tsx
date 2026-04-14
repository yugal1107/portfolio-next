import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { resolveImageUrl } from "@/lib/cloudinary";
import type { StoryCard } from "@/types/content";

type StoryCardProps = {
  story: StoryCard;
};

export function StoryCard({ story }: StoryCardProps) {
  const imageUrl = resolveImageUrl(story.cardImageUrl, story.cardImagePublicId, "storyCard");

  return (
    <Link href={`/story/${story.slug}`} className="group block">
      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4">
        <Image 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          src={imageUrl || "https://picsum.photos/seed/story/600/400"}
          alt={story.title}
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-4 text-xs font-bold text-white/60 uppercase tracking-widest">
          {story.dateText && (
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {story.dateText}</span>
          )}
          {story.location && (
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {story.location}</span>
          )}
        </div>
        <h4 className="text-xl font-headline font-bold text-white group-hover:text-primary transition-colors duration-300">{story.title}</h4>
      </div>
    </Link>
  );
}