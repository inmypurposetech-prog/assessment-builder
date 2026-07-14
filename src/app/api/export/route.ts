import { NextResponse } from "next/server";
import {
  buildExportPack,
  exportRequestSchema,
  isGeneratedAssessment,
} from "@/lib/export";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = exportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { assessmentId } = parsed.data;

  const { data: assessment, error: loadError } = await supabase
    .from("assessments")
    .select("id, title, generated_content, user_id")
    .eq("id", assessmentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 });
  }
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  if (!isGeneratedAssessment(assessment.generated_content)) {
    return NextResponse.json(
      {
        error:
          "No saved paper to export yet. Build and save a paper on the review screen first.",
        code: "NO_GENERATED_CONTENT",
      },
      { status: 400 },
    );
  }

  try {
    const pack = await buildExportPack(assessment.generated_content);
    return new NextResponse(new Uint8Array(pack.body), {
      status: 200,
      headers: {
        "Content-Type": pack.mimeType,
        "Content-Disposition": `attachment; filename="${pack.filename}"`,
        "Cache-Control": "no-store",
        "X-AssessMate-Export-Kind": pack.kind,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
