"use client";

import { useState, type ReactElement, type ReactNode } from "react";
import { PencilIcon, PlusIcon } from "lucide-react";
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
  type Source,
  type Status,
  type WorkModel,
} from "@/lib/types";
import { t } from "@/messages";

type FieldName = keyof typeof t.form.fields;
type Errors = Partial<Record<FieldName, string>>;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Reads the form, validates it and returns either errors or the new record.
function parseForm(
  form: FormData
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

  if (!company) errors.company = t.form.errors.required;
  if (!role) errors.role = t.form.errors.required;
  if (!status) errors.status = t.form.errors.required;
  if (jobUrl && !isValidUrl(jobUrl)) errors.job_url = t.form.errors.url;

  const fitScore = fitRaw === null ? null : Number(fitRaw);
  if (
    fitScore !== null &&
    !(Number.isInteger(fitScore) && fitScore >= 0 && fitScore <= 100)
  ) {
    errors.fit_score = t.form.errors.fitScore;
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
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={name}>
        {t.form.fields[name]}
        {required && <span aria-hidden="true">*</span>}
      </Label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
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
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  // Snapshot of the values when the dialog opened. Saving updates the
  // application while the close animation still runs; the form must keep
  // its initial values until it is gone.
  const [initial, setInitial] = useState(application);
  const title = application ? t.form.editApplication : t.form.newApplication;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setErrors({});
      setInitial(application);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = parseForm(new FormData(e.currentTarget));
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
          noValidate
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <div className="-mx-5 grid min-h-0 gap-4 overflow-y-auto px-5 py-1 sm:grid-cols-2">
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
                defaultValue={initial?.status ?? "discovered"}
                invalid={!!errors.status}
              />
            </Field>
            <Field name="applied_at">
              <Input {...input("applied_at")} type="date" />
            </Field>
            <Field name="job_url" error={errors.job_url} className="sm:col-span-2">
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
                defaultValue={initial?.source}
              />
            </Field>
            <Field name="work_model">
              <ChoiceSelect
                name="work_model"
                keys={WORK_MODELS}
                labels={t.options.work_model}
                defaultValue={initial?.work_model}
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
            <Field name="notes" className="sm:col-span-2">
              <Textarea {...input("notes")} rows={3} />
            </Field>
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
