export type SiteSettings = {
  fullName: string;
  title: string;
  bio: string;
  location: string | null;
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  resumeUrl: string | null;
  profileImageUrl: string | null;
  profileImagePublicId: string | null;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  techStack: string[];
  featured: boolean;
  orderIndex: number;
};

export type Skill = {
  id: number;
  name: string;
  iconKey: string | null;
  orderIndex: number;
};

export type SkillGroup = {
  id: number;
  name: string;
  orderIndex: number;
  skills: Skill[];
};

export type HomePayload = {
  settings: SiteSettings | null;
  projects: Project[];
  skillGroups: SkillGroup[];
};

export type StoryCard = {
  title: string;
  slug: string;
  dateText: string | null;
  location: string | null;
  status: string | null;
  cardImageUrl: string | null;
  cardImagePublicId: string | null;
  orderIndex: number;
};

export type StoryDetail = {
  title: string;
  slug: string;
  dateText: string | null;
  location: string | null;
  status: string | null;
  cardImageUrl: string | null;
  cardImagePublicId: string | null;
  images: string[];
  imagePublicIds: string[];
  contentMarkdown: string;
  project: Record<string, unknown> | null;
  outcomes: string[];
  team: Record<string, unknown> | null;
};

export type AdminMe = {
  username: string;
  role?: string;
};

export type ContactMessageStatus = "new" | "read" | "archived";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
};

export type BlogPostCard = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  tags: string[];
  isPublished: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostDetail = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  contentMarkdown: string;
  tags: string[];
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  isPublished: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};
