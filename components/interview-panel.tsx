"use client";

import { useState } from "react";
import { LoaderCircleIcon, MessagesSquareIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoProfileHint } from "@/components/fit-panel";
import { jobFromApplication, type FitErrorCode } from "@/lib/fit-client";
import { updateApplication, useAppData } from "@/lib/storage";
import type { Application, InterviewAdvice } from "@/lib/types";
import { useLang, useT } from "@/lib/i18n";

// Story 14: interview preparation for one job, generated from the saved
// fields and the profile, stored with the application.
export function InterviewSection({ app }: { app: Application }) {
  const t = useT();
  const i = t.interview;
  const lang = useLang();
  const { profile } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FitErrorCode | null>(null);
  const prep = app.interview_prep;

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, job: jobFromApplication(app), lang }),
      });
      const data = await response.json();
      if (!response.ok || !data.prep) {
        setError(data.error in t.fit.errors ? data.error : "aiFailed");
      } else {
        updateApplication(app.id, {
          ...app,
          interview_prep: { ...data.prep, created_at: new Date().toISOString() },
        });
      }
    } catch {
      setError("aiFailed");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-5 py-3 text-sm">
      {prep ? (
        <>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            <SparklesIcon className="size-3" />
            {t.fit.aiLabel}
          </span>
          <div>
            <h3 className="font-medium tracking-[-0.02em]">{i.questions}</h3>
            <ol className="mt-2 list-decimal space-y-3 pl-5">
              {prep.questions.map((q, n) => (
                <li key={n}>
                  <p>{q.question}</p>
                  <p className="mt-1 text-muted-foreground">
                    {q.example ? (
                      <>
                        <span className="text-foreground">{i.example}: </span>
                        {q.example}
                      </>
                    ) : (
                      <span className="italic">
                        {q.advice ? i.noExampleAdvice : i.noExample}
                      </span>
                    )}
                  </p>
                  {q.advice && <Advice advice={q.advice} />}
                </li>
              ))}
            </ol>
          </div>
          {prep.ask.length > 0 && (
            <div>
              <h3 className="font-medium tracking-[-0.02em]">{i.ask}</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {prep.ask.map((a, n) => (
                  <li key={n}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground">{i.intro}</p>
      )}

      {profile ? (
        <div className="grid justify-items-start gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={loading}
            onClick={handleClick}
          >
            {loading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <MessagesSquareIcon />
            )}
            {loading ? i.loading : prep ? i.regenerate : i.prepare}
          </Button>
          {error && (
            <p role="alert" className="text-destructive">
              {t.fit.errors[error]}
            </p>
          )}
        </div>
      ) : (
        <NoProfileHint />
      )}
    </div>
  );
}

// Coaching for a question the profile covers not or only partly.
function Advice({ advice }: { advice: InterviewAdvice }) {
  const t = useT();
  const labels = t.interview.advice;
  return (
    <div className="mt-2 space-y-1.5 rounded-xl bg-muted/60 p-3">
      <p className="font-medium">{t.interview.adviceIntro}</p>
      {(["assessment", "bridge", "first_step"] as const).map((key) => (
        <p key={key}>
          <span className="text-muted-foreground">{labels[key]}: </span>
          {advice[key]}
        </p>
      ))}
      <blockquote className="mt-2 border-l-2 border-foreground/40 pl-3">
        <span className="text-muted-foreground">{labels.wording}: </span>
        {t.interview.quote(advice.wording)}
      </blockquote>
    </div>
  );
}
