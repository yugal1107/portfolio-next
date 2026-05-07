import type { AdminMe, ContactMessage, ContactMessageStatus } from "@/types/content";

import { fetchApiJson } from "./client";

export const loginAdmin = async (credentials: { username: string; password: string }) => {
  return fetchApiJson<{ success: true; message?: string }>("/api/admin/login", {
    method: "POST",
    body: credentials,
    cache: "no-store",
  });
};

export const logoutAdmin = async () => {
  return fetchApiJson<{ success: true; message?: string }>("/api/admin/logout", {
    method: "POST",
    cache: "no-store",
  });
};

export const getAdminMe = async () => {
  return fetchApiJson<AdminMe>("/api/admin/me", { cache: "no-store" });
};

export const getAdminContactMessages = async () => {
  return fetchApiJson<ContactMessage[]>("/api/admin/content/contact-messages", {
    cache: "no-store",
  });
};

export const updateAdminContactMessageStatus = async (
  id: number,
  status: ContactMessageStatus,
) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/contact-messages/${id}/status`, {
    method: "PUT",
    body: { status },
    cache: "no-store",
  });
};

export const deleteAdminContactMessage = async (id: number) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/contact-messages/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
};

export const getAdminSettings = async () => {
  return fetchApiJson<{
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
  }>("/api/admin/content/settings", { cache: "no-store" });
};

export const patchAdminSettings = async (payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true; message?: string }>("/api/admin/content/settings", {
    method: "PATCH",
    body: payload,
    cache: "no-store",
  });
};

export const getAdminProjects = async () => {
  return fetchApiJson<
    Array<{
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
      isPublished: boolean;
    }>
  >("/api/admin/content/projects", { cache: "no-store" });
};

export const createAdminProject = async (payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true; data?: { id: number } }>("/api/admin/content/projects", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
};

export const updateAdminProject = async (id: number, payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/projects/${id}`, {
    method: "PUT",
    body: payload,
    cache: "no-store",
  });
};

export const deleteAdminProject = async (id: number) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/projects/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
};

export const getAdminSkillGroups = async () => {
  return fetchApiJson<
    Array<{
      id: number;
      name: string;
      orderIndex: number;
      isPublished: boolean;
      skills: Array<{ id: number; name: string; iconKey: string | null; orderIndex: number; isPublished: boolean }>;
    }>
  >("/api/admin/content/skill-groups", { cache: "no-store" });
};

export const createAdminSkillGroup = async (payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true; data?: { id: number } }>("/api/admin/content/skill-groups", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
};

export const updateAdminSkillGroup = async (id: number, payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/skill-groups/${id}`, {
    method: "PUT",
    body: payload,
    cache: "no-store",
  });
};

export const deleteAdminSkillGroup = async (id: number) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/skill-groups/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
};

export const createAdminSkill = async (payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true; data?: { id: number } }>("/api/admin/content/skills", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
};

export const updateAdminSkill = async (id: number, payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/skills/${id}`, {
    method: "PUT",
    body: payload,
    cache: "no-store",
  });
};

export const deleteAdminSkill = async (id: number) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/skills/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
};

export const getAdminStories = async () => {
  return fetchApiJson<
    Array<{
      id: number;
      title: string;
      slug: string;
      dateText: string | null;
      location: string | null;
      status: string | null;
      cardImageUrl: string | null;
      orderIndex: number;
      isPublished: boolean;
    }>
  >("/api/admin/content/stories", { cache: "no-store" });
};

export const getAdminStory = async (id: number) => {
  return fetchApiJson<{
    id: number;
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
    orderIndex: number;
    isPublished: boolean;
  }>(`/api/admin/content/stories/${id}`, { cache: "no-store" });
};

export const createAdminStory = async (payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true; data?: { id: number } }>("/api/admin/content/stories", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
};

export const updateAdminStory = async (id: number, payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/stories/${id}`, {
    method: "PUT",
    body: payload,
    cache: "no-store",
  });
};

export const deleteAdminStory = async (id: number) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/stories/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
};

export const getAdminBlogPosts = async () => {
  return fetchApiJson<
    Array<{
      id: number;
      title: string;
      slug: string;
      summary: string | null;
      coverImageUrl: string | null;
      coverImagePublicId: string | null;
      tags: string[];
      orderIndex: number;
      isPublished: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  >("/api/admin/content/blog", { cache: "no-store" });
};

export const getAdminBlogPost = async (id: number) => {
  return fetchApiJson<{
    id: number;
    title: string;
    slug: string;
    summary: string | null;
    contentMarkdown: string;
    coverImageUrl: string | null;
    coverImagePublicId: string | null;
    tags: string[];
    orderIndex: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
  }>(`/api/admin/content/blog/${id}`, { cache: "no-store" });
};

export const createAdminBlogPost = async (payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true; data?: { id: number } }>("/api/admin/content/blog", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
};

export const updateAdminBlogPost = async (id: number, payload: Record<string, unknown>) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/blog/${id}`, {
    method: "PUT",
    body: payload,
    cache: "no-store",
  });
};

export const deleteAdminBlogPost = async (id: number) => {
  return fetchApiJson<{ success: true }>(`/api/admin/content/blog/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
};

export const uploadAdminFile = async (
  file: File,
  options?: { folder?: string; publicIdPrefix?: string; format?: string },
) => {
  const formData = new FormData();
  formData.append("file", file);
  if (options?.folder) formData.append("folder", options.folder);
  if (options?.publicIdPrefix) formData.append("publicIdPrefix", options.publicIdPrefix);
  if (options?.format) formData.append("format", options.format);

  const res = await fetch("/api/admin/upload/file", {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const payload = (await res.json()) as {
    success: boolean;
    message?: string;
    data?: {
      url: string;
      optimizedUrl: string;
      publicId: string;
      resourceType: string;
      format: string;
      bytes: number;
      originalFilename: string;
    };
  };

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || `Upload failed with status ${res.status}`);
  }

  return payload.data!;
};
