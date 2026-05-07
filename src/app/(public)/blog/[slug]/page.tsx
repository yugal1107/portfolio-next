import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailPage } from "@/components/blog-detail-page";
import { fetchPublicBlogPostBySlug } from "@/lib/domain/public";

export const revalidate = 300;
export const dynamic = "force-dynamic";

interface BlogPostRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blogPost = await fetchPublicBlogPostBySlug(slug);
    return {
      title: `${blogPost.title} | Yugal Burde Blog`,
      description: blogPost.summary || `Read ${blogPost.title} on Yugal Burde's technical blog.`,
      openGraph: {
        title: blogPost.title,
        description: blogPost.summary || undefined,
        type: "article",
        publishedTime: blogPost.createdAt,
        modifiedTime: blogPost.updatedAt,
        tags: blogPost.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: blogPost.title,
        description: blogPost.summary || undefined,
      },
    };
  } catch {
    return {
      title: "Blog Post | Yugal Burde",
    };
  }
}

export default async function BlogPostRoute({ params }: BlogPostRouteProps) {
  const { slug } = await params;

  let blogPost;
  try {
    blogPost = await fetchPublicBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  return <BlogDetailPage blogPost={blogPost} />;
}
