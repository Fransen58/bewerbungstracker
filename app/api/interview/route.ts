import type { FitLang } from "@/lib/fit";
import { prepareInterview } from "@/lib/interview";
import { ImportError } from "@/lib/job-import";

// Interview preparation (story 14): takes the user's profile and a saved job
// and returns likely questions with examples and questions to ask.
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
    const prep = await prepareInterview(profile.trim(), job.trim(), lang as FitLang);
    return Response.json({ prep });
  } catch (error) {
    if (error instanceof ImportError) {
      return Response.json({ error: error.code }, { status: 422 });
    }
    console.error("Interview: unexpected error", error);
    return Response.json({ error: "aiFailed" }, { status: 500 });
  }
}
