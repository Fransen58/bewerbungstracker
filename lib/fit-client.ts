import type { Application, FitAssessment } from "./types";
import type { Lang, Messages } from "@/messages";

// Browser side of the fit assessment (story 12), shared by the detail page
// and the "new application" dialog.

export type FitErrorCode = keyof Messages["fit"]["errors"];

// Describes a saved application for the model, from the fields that say
// something about the job. Labels are English, like the stored keys.
export function jobFromApplication(app: Application): string {
  const lines: [string, string | null][] = [
    ["Role", app.role],
    ["Company", app.company],
    ["Work model", app.work_model],
    ["Workation", app.workation],
    ["Salary", app.salary_range],
    ["Must-have requirements", app.requirements],
    ["Notes", app.notes],
  ];
  return lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export async function requestFit(
  profile: string,
  job: string,
  lang: Lang
): Promise<{ assessment: FitAssessment } | { error: FitErrorCode }> {
  try {
    const response = await fetch("/api/fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, job, lang }),
    });
    const data = await response.json();
    if (!response.ok || !data.assessment) {
      const known = ["badRequest", "notConfigured", "tooLong", "aiFailed"];
      return { error: known.includes(data.error) ? data.error : "aiFailed" };
    }
    return {
      assessment: { ...data.assessment, created_at: new Date().toISOString() },
    };
  } catch {
    return { error: "aiFailed" };
  }
}

// Below this score, with at least medium confidence, the app suggests
// discarding a job. With low confidence it asks for more information instead.
export const DISCARD_BELOW = 50;

export function suggestsDiscard(a: FitAssessment): boolean {
  return a.score < DISCARD_BELOW && a.confidence !== "low";
}
