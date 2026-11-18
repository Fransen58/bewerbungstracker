"use client";

import { useState } from "react";
import Link from "next/link";
import { InfoIcon, LoaderCircleIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  jobFromApplication,
  requestFit,
  type FitErrorCode,
} from "@/lib/fit-client";
import { updateApplication, useAppData } from "@/lib/storage";
import type { Application, FitAssessment } from "@/lib/types";
import { useLang, useT } from "@/lib/i18n";

// Story 12: shows a fit assessment and lets the user request one.

// Score, confidence, gap and reason. `score` is the fit shown to the user;
// when it differs from the AI's score, the user has overridden it.
export function FitSummary({
  score,
  assessment,
}: {
  score: number | null;
  assessment: FitAssessment | null;
}) {
  const t = useT();
  const f = t.fit;
  const isAi = assessment !== null && score === assessment.score;

  return (
    <div className="space-y-2 text-sm">
      {score !== null && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-2xl tracking-[-0.02em] tabular-nums">
            {f.percent(score)}
          </span>
          {isAi && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
              <SparklesIcon className="size-3" />
              {f.aiLabel}
            </span>
          )}
          {isAi && (
            <span className="text-muted-foreground">
              {f.confidence} {f.confidenceLevels[assessment.confidence]}
            </span>
          )}
        </div>
      )}
      {assessment && (
        <>
          {!isAi && (
            <p className="text-muted-foreground">
              {f.overridden(assessment.score)}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">{f.gap}: </span>
            {assessment.gap ?? f.noGap}
          </p>
          <p>{assessment.reason}</p>
          {isAi && assessment.confidence === "low" && (
            <p className="flex gap-2 text-muted-foreground">
              <InfoIcon className="mt-0.5 size-4 shrink-0" />
              {f.lowConfidenceHint}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// Button that requests an assessment. Without a profile it links to the
// profile page instead, so nothing is guessed.
export function AssessButton({
  job,
  label,
  onResult,
  variant = "secondary",
}: {
  job: string;
  label: string;
  onResult: (assessment: FitAssessment) => void;
  variant?: "default" | "secondary";
}) {
  const t = useT();
  const lang = useLang();
  const { profile } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FitErrorCode | null>(null);

  if (!profile) {
    return (
      <p className="text-sm text-muted-foreground">
        {t.fit.noProfile}{" "}
        <Link
          href="/profile"
          className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          {t.fit.toProfile}
        </Link>
      </p>
    );
  }

  async function handleClick() {
    setLoading(true);
    setError(null);
    const result = await requestFit(profile!, job, lang);
    setLoading(false);
    if ("error" in result) setError(result.error);
    else onResult(result.assessment);
  }

  return (
    <div className="grid justify-items-start gap-2">
      <Button
        type="button"
        size="sm"
        variant={variant}
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? <LoaderCircleIcon className="animate-spin" /> : <SparklesIcon />}
        {loading ? t.fit.loading : label}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {t.fit.errors[error]}
        </p>
      )}
    </div>
  );
}

// Detail page: the saved assessment plus a button to (re)assess from the
// saved fields. The result is stored right away and shown as AI suggestion.
export function FitSection({ app }: { app: Application }) {
  const t = useT();

  function store(assessment: FitAssessment) {
    updateApplication(app.id, {
      ...app,
      fit_score: assessment.score,
      fit_assessment: assessment,
    });
  }

  return (
    <div className="space-y-4 py-3">
      {app.fit_score === null && !app.fit_assessment ? (
        <p className="text-sm text-muted-foreground">–</p>
      ) : (
        <FitSummary score={app.fit_score} assessment={app.fit_assessment} />
      )}
      <AssessButton
        job={jobFromApplication(app)}
        label={app.fit_assessment ? t.fit.reassess : t.fit.assess}
        onResult={store}
      />
    </div>
  );
}
