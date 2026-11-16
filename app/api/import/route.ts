import { extractJob, fetchJobText, ImportError } from "@/lib/job-import";

// Job ad import (story 11): takes a link or the pasted text of a job ad and
// returns suggested form fields. Nothing is stored here; the user reviews
// the suggestions in the form before saving.

export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "badRequest" }, { status: 400 });
  }
  const { url, text } = (body ?? {}) as { url?: unknown; text?: unknown };

  try {
    let adText: string;
    if (typeof url === "string" && url.trim() !== "") {
      adText = await fetchJobText(url.trim());
    } else if (typeof text === "string" && text.trim() !== "") {
      adText = text.trim();
    } else {
      return Response.json({ error: "badRequest" }, { status: 400 });
    }
    return Response.json({ draft: await extractJob(adText) });
  } catch (error) {
    if (error instanceof ImportError) {
      return Response.json({ error: error.code }, { status: 422 });
    }
    console.error("Import: unexpected error", error);
    return Response.json({ error: "aiFailed" }, { status: 500 });
  }
}
