import type { HomePayload, StoryCard, StoryDetail } from "@/types/content";

import { fetchApiJson } from "./client";

export const getPublicHome = async (): Promise<HomePayload> => {
  return fetchApiJson<HomePayload>("/api/public/home", { cache: "no-store" });
};

export const getPublicStories = async (): Promise<StoryCard[]> => {
  return fetchApiJson<StoryCard[]>("/api/public/stories", { cache: "no-store" });
};

export const getPublicStoryBySlug = async (slug: string): Promise<StoryDetail> => {
  return fetchApiJson<StoryDetail>(`/api/public/stories/${slug}`, { cache: "no-store" });
};

export const submitContactMessage = async (contactPayload: {
  name: string;
  email: string;
  message: string;
  website?: string;
}) => {
  return fetchApiJson<{ success: true; message?: string }>("/api/public/contact", {
    method: "POST",
    body: contactPayload,
    cache: "no-store",
  });
};
