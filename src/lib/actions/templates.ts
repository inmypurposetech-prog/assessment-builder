"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ExamBody, Subject } from "@/lib/types/assessment";
import {
  MAX_PRIVATE_TEMPLATES,
  TEMPLATE_BUCKET,
  TEMPLATE_MAX_BYTES,
  isAllowedTemplateMime,
  sanitizeTemplateFilename,
  type TemplateRecord,
} from "@/lib/types/template";

type TemplateRow = {
  id: string;
  title: string;
  subject: string | null;
  exam_body: string | null;
  visibility: string;
  storage_path: string;
  mime_type: string | null;
  original_filename: string | null;
  file_size_bytes: number | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: TemplateRow): TemplateRecord {
  return {
    id: row.id,
    title: row.title,
    subject: (row.subject as Subject | null) ?? null,
    examBody: (row.exam_body as ExamBody | null) ?? null,
    visibility: "private",
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    originalFilename: row.original_filename,
    fileSizeBytes: row.file_size_bytes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listTemplates(): Promise<TemplateRecord[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/templates");
  }

  const { data, error } = await supabase
    .from("templates")
    .select(
      "id, title, subject, exam_body, visibility, storage_path, mime_type, original_filename, file_size_bytes, created_at, updated_at",
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as TemplateRow[] | null)?.map(mapRow) ?? [];
}

export type UploadTemplateResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Upload a private template pack (PDF / DOCX / ZIP).
 * Educator-owned materials only — do not upload learner PII or marks.
 */
export async function uploadTemplate(
  formData: FormData,
): Promise<UploadTemplateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/templates");
  }

  const titleRaw = String(formData.get("title") ?? "").trim();
  const subjectRaw = String(formData.get("subject") ?? "").trim();
  const examBodyRaw = String(formData.get("examBody") ?? "").trim();
  const file = formData.get("file");

  if (!titleRaw) {
    return { ok: false, error: "Give your template a short name." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a PDF, Word, or ZIP file to upload." };
  }

  if (file.size > TEMPLATE_MAX_BYTES) {
    return {
      ok: false,
      error: "That file is too large. Keep templates under 10 MB.",
    };
  }

  const mime = file.type || "application/octet-stream";
  if (!isAllowedTemplateMime(mime)) {
    return {
      ok: false,
      error: "Upload a PDF, Word (.doc / .docx), or ZIP template pack.",
    };
  }

  const subject =
    subjectRaw === "Mathematics" || subjectRaw === "Life Sciences"
      ? subjectRaw
      : null;
  const examBody =
    examBodyRaw === "DBE" || examBodyRaw === "IEB" ? examBodyRaw : null;

  const { count, error: countError } = await supabase
    .from("templates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    return { ok: false, error: countError.message };
  }

  if ((count ?? 0) >= MAX_PRIVATE_TEMPLATES) {
    return {
      ok: false,
      error: `Free accounts can store ${MAX_PRIVATE_TEMPLATES} private template for now. Delete the current one to upload another, or keep AssessMate defaults.`,
    };
  }

  const templateId = crypto.randomUUID();
  const safeName = sanitizeTemplateFilename(file.name);
  const storagePath = `${user.id}/${templateId}/${safeName}`;

  // Placeholder path until Storage succeeds (NOT NULL constraint).
  const { error: insertError } = await supabase.from("templates").insert({
    id: templateId,
    user_id: user.id,
    title: titleRaw.slice(0, 120),
    subject,
    exam_body: examBody,
    visibility: "private",
    storage_path: storagePath,
    mime_type: mime,
    original_filename: safeName,
    file_size_bytes: file.size,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(TEMPLATE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mime,
      upsert: false,
    });

  if (uploadError) {
    await supabase
      .from("templates")
      .delete()
      .eq("id", templateId)
      .eq("user_id", user.id);
    return {
      ok: false,
      error:
        uploadError.message ||
        "We could not store the file. Try again, or apply migration 004 if Storage is not set up yet.",
    };
  }

  revalidatePath("/templates");
  revalidatePath("/dashboard");
  revalidatePath("/assessments/new/wizard");
  return { ok: true, id: templateId };
}

export type DeleteTemplateResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteTemplate(
  templateId: string,
): Promise<DeleteTemplateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/templates");
  }

  const { data: row, error: loadError } = await supabase
    .from("templates")
    .select("id, storage_path")
    .eq("id", templateId)
    .eq("user_id", user.id)
    .single();

  if (loadError || !row) {
    return { ok: false, error: "That template was not found." };
  }

  const path = row.storage_path as string;
  if (path) {
    await supabase.storage.from(TEMPLATE_BUCKET).remove([path]);
  }

  const { error: deleteError } = await supabase
    .from("templates")
    .delete()
    .eq("id", templateId)
    .eq("user_id", user.id);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  revalidatePath("/templates");
  revalidatePath("/dashboard");
  revalidatePath("/assessments/new/wizard");
  return { ok: true };
}
