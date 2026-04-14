import { HomePage } from "@/components/home-page";
import { fetchPublicHome, fetchPublicStories } from "@/lib/domain/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function Home() {
  const [homeData, stories] = await Promise.all([fetchPublicHome(), fetchPublicStories()]);

  return <HomePage homeData={homeData} stories={stories} />;
}
