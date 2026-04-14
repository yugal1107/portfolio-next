import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound } from "next/navigation";

import { StoryDetailPage } from "@/components/story-detail-page";
import { fetchPublicStoryBySlug } from "@/lib/domain/public";

type StoryRouteProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function StoryRoute({ params }: StoryRouteProps) {
  const { slug } = await params;
  let story;

  try {
    story = await fetchPublicStoryBySlug(slug);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return notFound();
  }

  return <StoryDetailPage story={story} />;
}
