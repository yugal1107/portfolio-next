import { BlogPage } from "@/components/blog-page";
import { fetchPublicBlogPosts } from "@/lib/domain/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function BlogRoute() {
  const blogPosts = await fetchPublicBlogPosts();
  return <BlogPage blogPosts={blogPosts} />;
}
