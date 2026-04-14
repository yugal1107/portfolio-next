import type { StoryCard as StoryCardType } from "@/types/content";
import { StoryCard } from "./stories/story-card";

type StoriesPageProps = {
  stories: StoryCardType[];
};

export function StoriesPage({ stories }: StoriesPageProps) {
  const sortedStories = [...stories].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <main className="relative z-10 min-h-screen pt-20">
      <section className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-sm font-headline font-medium tracking-[0.4em] uppercase text-outline mb-4">Experiences</h2>
            <h3 className="text-5xl font-headline font-bold tracking-tighter">My Stories</h3>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedStories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </section>
    </main>
  );
}