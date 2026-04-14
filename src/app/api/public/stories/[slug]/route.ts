import { fetchNativePublicStoryBySlug } from "@/lib/native/public-stories";

type StorySlugRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: StorySlugRouteProps) {
  const { slug } = await params;

  const nativePayload = await fetchNativePublicStoryBySlug(slug);
  if (nativePayload) {
    return Response.json({
      success: true,
      data: nativePayload,
    });
  }

  return Response.json({ success: false, message: "Story not found" }, { status: 404 });
}
