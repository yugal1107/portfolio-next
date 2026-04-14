import type { HomePayload, StoryCard, StoryDetail } from "@/types/content";

import { createNativeContactMessage } from "@/lib/native/public-contact";
import { fetchNativePublicHome } from "@/lib/native/public-home";
import { fetchNativePublicStories, fetchNativePublicStoryBySlug } from "@/lib/native/public-stories";

export const fetchPublicHome = async () => {
  const payload = await fetchNativePublicHome();

  if (!payload) {
    throw new Error("Public home data unavailable");
  }

  return payload satisfies HomePayload;
};

export const fetchPublicStories = async () => {
  const payload = await fetchNativePublicStories();

  if (!payload) {
    throw new Error("Public stories data unavailable");
  }

  return payload satisfies StoryCard[];
};

export const fetchPublicStoryBySlug = async (slug: string) => {
  const payload = await fetchNativePublicStoryBySlug(slug);

  if (!payload) {
    throw new Error("Story not found");
  }

  return payload satisfies StoryDetail;
};

export const createContactMessage = async (contactPayload: {
  name: string;
  email: string;
  message: string;
  website?: string;
}) => {
  const payload = await createNativeContactMessage(contactPayload);

  if (!payload) {
    throw new Error("Unable to create contact message");
  }

  return payload;
};
