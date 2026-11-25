"use client";

import { useRef, useState, type ReactElement, type ReactNode } from "react";
import {
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  addApplication,
  updateApplication,
  type NewApplication,
} from "@/lib/storage";
import {
  SOURCES,
  STATUSES,
  WORK_MODELS,
  type Application,
  type FitAssessment,
  type InterviewPrep,
  type Source,
  type Status,
  type WorkModel,
} from "@/lib/types";
import { useT } from "@/lib/i18n";
import type { JobDraft } from "@/lib/job-import";
import { suggestsDiscard } from "@/lib/fit-client";
import { AssessButton, FitSummary } from "@/components/fit-panel";
import type { Messages } from "@/messages";

type FieldName = keyof Messages["form"]["fields"];
// Errors store the kind only; the text is translated when rendered, so a
// language switch also updates visible errors.
type ErrorKind = keyof Messages["form"]["errors"];
type Errors = Partial<Record<FieldName, ErrorKind>>;
// Values the form starts with: an application when editing, an imported
// draft when creating.
type FormValues = Partial<Record<FieldName, string | number | null>>;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Reads the form, validates it and returns either errors or the new record.
// Fit assessment and interview prep are not form fields and are passed through.
function parseForm(
  form: FormData,
  fitAssessment: FitAssessment | null,
  interviewPrep: InterviewPrep | null
): { errors: Errors } | { value: NewApplication } {
  const text = (name: FieldName) => {
    const v = String(form.get(name) ?? "").trim();
    return v === "" ? null : v;
  };

  const errors: Errors = {};
  const company = text("company");
  const role = text("role");
  const status = text("status");
  const jobUrl = text("job_url");
  const fitRaw = text("fit_score");

  if (!company) errors.company = "required";
  if (!role) errors.role = "required";
  if (!status) errors.status = "required";
  if (jobUrl && !isValidUrl(jobUrl)) errors.job_url = "url";

  const fitScore = fitRaw === null ? null : Number(fitRaw);
  if (
    fitScore !== null &&
    !(Number.isInteger(fitScore) && fitScore >= 0 && fitScore <= 100)
  ) {
    errors.fit_score = "fitScore";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    value: {
      company: company!,
      role: role!,
      status: status as Status,
      job_url: jobUrl,
      source: text("source") as Source | null,
      work_model: text("work_model") as WorkModel | null,
      workation: text("workation"),
      salary_range: text("salary_range"),
      fit_score: fitScore,
      contact_name: text("contact_name"),
      contact_email: text("contact_email"),
      cv_version: text("cv_version"),
      requirements: text("requirements"),
      fit_assessment: fitAssessment,
      interview_prep: interviewPrep,
      notes: text("notes"),
      applied_at: text("applied_at"),
      next_step: text("next_step"),
      next_step_date: text("next_step_date"),
    },
  };
}

function Field({
  name,
  error,
  required,
  className,
  children,
}: {
  name: FieldName;
  error?: ErrorKind;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={name}>
        {t.form.fields[name]}
        {required && <span aria-hidden="true">*</span>}
      </Label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {t.form.errors[error]}
        </p>
      )}
    </div>
  );
}

function ChoiceSelect<K extends string>({
  name,
  keys,
  labels,
  defaultValue,
  invalid,
}: {
  name: FieldName;
  keys: readonly K[];
  labels: Record<K, string>;
  defaultValue?: K | null;
  invalid?: boolean;
}) {
  const t = useT();
  return (
    <Select name={name} items={labels} defaultValue={defaultValue}>
      <SelectTrigger id={name} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={t.form.choose} />
      </SelectTrigger>
      <SelectContent>
        {keys.map((key) => (
          <SelectItem key={key} value={key}>
            {labels[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// "compact" (header): icon only on small screens. "full": always labeled.
export function NewApplicationDialog({
  trigger = "compact",
}: {
  trigger?: "compact" | "full";
}) {
  const t = useT();
  return (
    <ApplicationDialog
      triggerButton={<Button aria-label={t.form.newApplication} />}
      triggerContent={
        <>
          <PlusIcon />
          <span className={cn(trigger === "compact" && "hidden sm:inline")}>
            {t.form.newApplication}
          </span>
        </>
      }
    />
  );
}

export function EditApplicationDialog({
  application,
}: {
  application: Application;
}) {
  const t = useT();
  return (
    <ApplicationDialog
      application={application}
      triggerButton={<Button variant="secondary" />}
      triggerContent={
        <>
          <PencilIcon />
          {t.detail.edit}
        </>
      }
    />
  );
}

// Shared dialog for creating (no application) and editing an application.
function ApplicationDialog({
  application,
  triggerButton,
  triggerContent,
}: {
  application?: Application;
  triggerButton: ReactElement;
  triggerContent: ReactNode;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  // Snapshot of the values when the dialog opened. Saving updates the
  // application while the close animation still runs; the form must keep
  // its initial values until it is gone.
  const [initial, setInitial] = useState<FormValues | undefined>(application);
  // Changing the key re-creates the fields with new start values.
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  // Story 12: the imported ad text and an optional fit check of it.
  const [adText, setAdText] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<FitAssessment | null>(null);
  const title = application ? t.form.editApplication : t.form.newApplication;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setErrors({});
      setInitial(application);
      setAdText(null);
      setAssessment(null);
    }
  }

  // Fills in the given fields; whatever the user typed elsewhere stays.
  function fillForm(values: FormValues) {
    const typed = [...new FormData(formRef.current!).entries()].filter(
      ([, v]) => v !== ""
    );
    const found = Object.entries(values).filter(([, v]) => v !== null);
    setInitial(Object.fromEntries([...typed, ...found]) as FormValues);
    setErrors({});
    setFormKey((k) => k + 1);
  }

  function applyDraft(draft: JobDraft, url: string | null, text: string) {
    fillForm({ ...draft, job_url: url });
    setAdText(text);
    setAssessment(null);
  }

  function applyAssessment(result: FitAssessment) {
    fillForm({ fit_score: result.score });
    setAssessment(result);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = parseForm(
      new FormData(e.currentTarget),
      application ? application.fit_assessment : assessment,
      application?.interview_prep ?? null
    );
    if ("errors" in result) {
      setErrors(result.errors);
      return;
    }
    if (application) updateApplication(application.id, result.value);
    else addApplication(result.value);
    setOpen(false);
  }

  // Shared props for plain text inputs, prefilled when editing.
  const input = (name: FieldName) => {
    const value = initial?.[name];
    return {
      id: name,
      name,
      defaultValue: value == null ? "" : String(value),
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={triggerButton}>{triggerContent}</DialogTrigger>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-[-0.03em]">
            {title}
          </DialogTitle>
          <DialogDescription>{t.form.description}</DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <div className="-mx-5 min-h-0 space-y-6 overflow-y-auto px-5 py-1">
            {!application && <ImportBox onDraft={applyDraft} />}
            {adText && (
              <FitCheck
                job={adText}
                assessment={assessment}
                onResult={applyAssessment}
                onDiscard={() => setOpen(false)}
              />
            )}
            <div key={formKey} className="grid gap-4 sm:grid-cols-2">
              <Field name="company" required error={errors.company}>
                <Input {...input("company")} autoFocus />
              </Field>
              <Field name="role" required error={errors.role}>
                <Input {...input("role")} />
              </Field>
              <Field name="status" required error={errors.status}>
                <ChoiceSelect
                  name="status"
                  keys={STATUSES}
                  labels={t.options.status}
                  defaultValue={
                    (initial?.status as Status | undefined) ?? "discovered"
                  }
                  invalid={!!errors.status}
                />
              </Field>
              <Field name="applied_at">
                <Input {...input("applied_at")} type="date" />
              </Field>
              <Field
                name="job_url"
                error={errors.job_url}
                className="sm:col-span-2"
              >
                <Input
                  {...input("job_url")}
                  type="url"
                  inputMode="url"
                  placeholder={t.form.placeholders.job_url}
                />
              </Field>
              <Field name="source">
                <ChoiceSelect
                  name="source"
                  keys={SOURCES}
                  labels={t.options.source}
                  defaultValue={initial?.source as Source | null | undefined}
                />
              </Field>
              <Field name="work_model">
                <ChoiceSelect
                  name="work_model"
                  keys={WORK_MODELS}
                  labels={t.options.work_model}
                  defaultValue={
                    initial?.work_model as WorkModel | null | undefined
                  }
                />
              </Field>
              <Field name="workation">
                <Input
                  {...input("workation")}
                  placeholder={t.form.placeholders.workation}
                />
              </Field>
              <Field name="salary_range">
                <Input
                  {...input("salary_range")}
                  placeholder={t.form.placeholders.salary_range}
                />
              </Field>
              <Field name="fit_score" error={errors.fit_score}>
                <Input
                  {...input("fit_score")}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                />
              </Field>
              <Field name="cv_version">
                <Input
                  {...input("cv_version")}
                  placeholder={t.form.placeholders.cv_version}
                />
              </Field>
              <Field name="contact_name">
                <Input {...input("contact_name")} />
              </Field>
              <Field name="contact_email">
                <Input {...input("contact_email")} type="email" />
              </Field>
              <Field name="next_step">
                <Input {...input("next_step")} />
              </Field>
              <Field name="next_step_date">
                <Input {...input("next_step_date")} type="date" />
              </Field>
              <Field name="requirements" className="sm:col-span-2">
                <Textarea
                  {...input("requirements")}
                  rows={3}
                  placeholder={t.form.placeholders.requirements}
                />
              </Field>
              <Field name="notes" className="sm:col-span-2">
                <Textarea {...input("notes")} rows={3} />
              </Field>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t.form.cancel}
            </Button>
            <Button type="submit">{t.form.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ImportState =
  | { kind: "idle" | "loading" | "success" }
  | { kind: "error"; code: keyof Messages["form"]["import"]["errors"] };

// Story 11: reads a job ad (link or pasted text) on the server and hands the
// suggested fields to the form. Nothing is saved until the user clicks Save.
function ImportBox({
  onDraft,
}: {
  onDraft: (draft: JobDraft, url: string | null, text: string) => void;
}) {
  const t = useT();
  const m = t.form.import;
  const [value, setValue] = useState("");
  const [state, setState] = useState<ImportState>({ kind: "idle" });

  async function handleImport() {
    const input = value.trim();
    const isUrl = /^https?:\/\/\S+$/i.test(input);
    setState({ kind: "loading" });
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isUrl ? { url: input } : { text: input }),
      });
      const data = await response.json();
      if (!response.ok || !data.draft) {
        const code = data.error in m.errors ? data.error : "aiFailed";
        setState({ kind: "error", code });
        return;
      }
      onDraft(data.draft, isUrl ? input : null, data.text);
      setState({ kind: "success" });
    } catch {
      setState({ kind: "error", code: "aiFailed" });
    }
  }

  const loading = state.kind === "loading";
  return (
    <div className="grid gap-3 rounded-2xl bg-muted/60 p-4">
      <Label htmlFor="job-import" className="flex items-center gap-2">
        <SparklesIcon className="size-4" />
        {m.label}
      </Label>
      <Textarea
        id="job-import"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={m.placeholder}
        rows={2}
        className="bg-background"
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={loading || value.trim() === ""}
          onClick={handleImport}
        >
          {loading ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <SparklesIcon />
          )}
          {loading ? m.loading : m.button}
        </Button>
        <p className="text-sm text-muted-foreground">{m.hint}</p>
      </div>
      {state.kind === "success" && (
        <p role="status" className="text-sm text-muted-foreground">
          {m.success}
        </p>
      )}
      {state.kind === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {m.errors[state.code]}
        </p>
      )}
    </div>
  );
}

// Story 12: optional fit check of an imported ad before saving. Below 50 %
// (with at least medium confidence) it suggests discarding the job; saving
// stays possible, the user decides.
function FitCheck({
  job,
  assessment,
  onResult,
  onDiscard,
}: {
  job: string;
  assessment: FitAssessment | null;
  onResult: (assessment: FitAssessment) => void;
  onDiscard: () => void;
}) {
  const t = useT();
  return (
    <div className="grid gap-3 rounded-2xl bg-muted/60 p-4">
      {assessment ? (
        <FitSummary score={assessment.score} assessment={assessment} />
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <AssessButton
            job={job}
            label={t.fit.check}
            onResult={onResult}
            newTab
          />
          <p className="text-sm text-muted-foreground">{t.fit.checkHint}</p>
        </div>
      )}
      {assessment && suggestsDiscard(assessment) && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-t pt-3"
        >
          <p className="text-sm font-medium">{t.fit.discardSuggestion}</p>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={onDiscard}
          >
            {t.fit.discard}
          </Button>
        </div>
      )}
    </div>
  );
}
