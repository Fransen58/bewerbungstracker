import { MAX_CV_BYTES, readCv } from "@/lib/cv";
import { ImportError } from "@/lib/job-import";

// CV upload (story 12): takes a PDF and returns a profile text. Neither the
// file nor the text is stored here; the user reviews the text before saving.

export const maxDuration = 60;

export async function POST(request: Request) {
  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return Response.json({ error: "badRequest" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return Response.json({ error: "badRequest" }, { status: 400 });
  }
  if (file.size > MAX_CV_BYTES) {
    return Response.json({ error: "tooLarge" }, { status: 413 });
  }
  const pdf = Buffer.from(await file.arrayBuffer());
  // Checks the file signature, not just the name or the stated type.
  if (pdf.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return Response.json({ error: "notPdf" }, { status: 422 });
  }

  try {
    const profile = await readCv(pdf);
    if (!profile) return Response.json({ error: "notCv" }, { status: 422 });
    return Response.json({ profile });
  } catch (error) {
    if (error instanceof ImportError) {
      return Response.json({ error: error.code }, { status: 422 });
    }
    console.error("CV: unexpected error", error);
    return Response.json({ error: "aiFailed" }, { status: 500 });
  }
}
