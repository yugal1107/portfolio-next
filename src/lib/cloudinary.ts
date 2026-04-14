const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

const variantMap = {
  avatar: "f_auto,q_auto:good,c_thumb,g_face,w_240,h_240",
  projectCard: "f_auto,q_auto:eco,c_fill,w_800,h_480",
  storyCard: "f_auto,q_auto:eco,c_fill,w_800,h_480",
  storyHero: "f_auto,q_auto:good,c_fill,w_1200,h_675",
  storyGallery: "f_auto,q_auto:good,c_limit,w_1200",
} as const;

type Variant = keyof typeof variantMap;

export const buildCloudinaryUrl = (publicId: string, variant: Variant = "projectCard") => {
  if (!publicId || !CLOUDINARY_CLOUD_NAME) {
    return "";
  }

  const transformation = variantMap[variant] || variantMap.projectCard;
  const encodedPublicId = publicId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${encodedPublicId}`;
};

const applyCloudinaryTransformation = (url: string | null | undefined, variant: Variant = "projectCard") => {
  if (!url || typeof url !== "string" || !url.includes("/upload/")) {
    return "";
  }

  const transformation = variantMap[variant] || variantMap.projectCard;

  if (url.includes(`/upload/${transformation}/`)) {
    return url;
  }

  return url.replace("/upload/", `/upload/${transformation}/`);
};

export const resolveImageUrl = (
  fallbackUrl: string | null | undefined,
  publicId: string | null | undefined,
  variant: Variant,
) => {
  const transformedFallback = applyCloudinaryTransformation(fallbackUrl, variant);
  if (transformedFallback) {
    return transformedFallback;
  }

  if (publicId && CLOUDINARY_CLOUD_NAME) {
    return buildCloudinaryUrl(publicId, variant);
  }

  return fallbackUrl || "";
};
