import type { HomePayload, StoryCard } from "@/types/content";
import {
  HeroSection,
  AboutSection,
  ExperienceSection,
  ProjectsSection,
  StoriesSection,
  StackSection,
  ContactSection,
} from "./home";

type HomePageProps = {
  homeData: HomePayload;
  stories: StoryCard[];
};

export function HomePage({ homeData, stories }: HomePageProps) {
  return (
    <main className="relative z-10 pt-20">
      <HeroSection settings={homeData.settings} />
      <AboutSection settings={homeData.settings} />
      <ExperienceSection />
      <ProjectsSection projects={homeData.projects} />
      <StoriesSection stories={stories} />
      <StackSection skillGroups={homeData.skillGroups} />
      <ContactSection settings={homeData.settings} />
    </main>
  );
}