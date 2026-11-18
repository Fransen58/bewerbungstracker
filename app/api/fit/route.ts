import { assessFit, type FitLang } from "@/lib/fit";
import { ImportError } from "@/lib/job-import";

// Fit assessment (story 12): takes the user's profile and a job (the full ad
// text after an import, or the saved fields) and returns the assessment.
// Nothing is stored here; the browser stores the result.

export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "badRequest" }, { status: 400 });
  }
  const { profile, job, lang } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof profile !== "string" ||
    profile.trim() === "" ||
    typeof job !== "string" ||
    job.trim() === "" ||
    (lang !== "de" && lang !== "en")
  ) {
    return Response.json({ error: "badRequest" }, { status: 400 });
  }

  try {
    const assessment = await assessFit(profile.trim(), job.trim(), lang as FitLang);
    return Response.json({ assessment });
  } catch (error) {
    if (error instanceof ImportError) {
      return Response.json({ error: error.code }, { status: 422 });
    }
    console.error("Fit: unexpected error", error);
    return Response.json({ error: "aiFailed" }, { status: 500 });
  }
}
