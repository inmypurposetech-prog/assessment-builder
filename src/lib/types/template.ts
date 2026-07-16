import type { ExamBody, Subject } from "@/lib/types/assessment";

/** Phase 1E: Private only. School / Public come in Phase 5. */
export type TemplateVisibility = "private";

export interface TemplateRecord {
  id: string;
  title: string;
  subject: Subject | null;
  examBody: ExamBody | null;
  visibility: TemplateVisibility;
  storagePath: string;
  mimeType: string | null;
  originalFilename: string | null;
  fileSizeBytes: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Free-tier posture (NORTH_STAR): 1 private pack until Teacher tier. */
export const MAX_PRIVATE_TEMPLATES = 1;

export const TEMPLATE_BUCKET = "templates";

export const TEMPLATE_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/zip",
  "application/x-zip-compressed",
] as const;

export const TEMPLATE_MAX_BYTES = 10 * 1024 * 1024; // 10 MiB

export function isAllowedTemplateMime(mime: string): boolean {
  return (TEMPLATE_ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function sanitizeTemplateFilename(name: string): string {
  const base = name.split(/[/\\]/).pop()?.trim() || "template";
  const cleaned = base.replace(/[^\w.\-()+\s]/g, "_").slice(0, 120);
  return cleaned.length > 0 ? cleaned : "template";
}
