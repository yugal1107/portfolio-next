import { ProjectsPage } from "@/components/projects";
import { fetchPublicHome } from "@/lib/domain/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function ProjectsRoute() {
  const homeData = await fetchPublicHome();
  return <ProjectsPage projects={homeData.projects} />;
}