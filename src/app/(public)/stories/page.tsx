import { StoriesPage } from "@/components/stories-page";
import { fetchPublicStories } from "@/lib/domain/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function StoriesRoute() {
  const stories = await fetchPublicStories();
  return <StoriesPage stories={stories} />;
}
