"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon, ArrowUpRightIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { EditApplicationDialog } from "@/components/application-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, StatusDot } from "@/components/status-badge";
import { formatDate, isOverdue, todayISO } from "@/lib/date";
import {
  addEvent,
  deleteApplication,
  useAppData,
  useStorageReady,
} from "@/lib/storage";
import {
  EVENT_TYPES,
  type Application,
  type ApplicationEvent,
  type EventType,
} from "@/lib/types";
import { useT } from "@/lib/i18n";

export function ApplicationDetail() {
  const t = useT();
  const id = useSearchParams().get("id");
  const { applications, events } = useAppData();
  const ready = useStorageReady();

  // Avoid flashing "not found" before browser data is available.
  if (!ready) return null;

  const app = applications.find((a) => a.id === id);
  if (!app) {
    return (
      <EmptyState text={t.detail.notFound}>
        <Button render={<Link href="/list" />} nativeButton={false}>
          {t.detail.backToList}
        </Button>
      </EmptyState>
    );
  }

  // Chronological, oldest first. Same-day events keep their creation order.
  const history = events
    .filter((e) => e.application_id === app.id)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return (
    <>
      <PageHeader title={app.company}>
        <div className="flex gap-2">
          <EditApplicationDialog application={app} />
          <DeleteButton application={app} />
        </div>
      </PageHeader>

      <div className="-mt-2 mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-lg tracking-[-0.02em]">{app.role}</p>
        <StatusBadge status={app.status} pill />
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {t.detail.created(
            new Date(app.created_at).toLocaleDateString(t.locale)
          )}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <Facts app={app} />
        <History applicationId={app.id} events={history} />
      </div>
    </>
  );
}

// ---------- Facts ----------

function Facts({ app }: { app: Application }) {
  const t = useT();
  const f = t.form.fields;
  const date = (d: string | null) =>
    d ? (
      <span className="font-mono text-[13px] tabular-nums">
        {formatDate(d, t.locale)}
      </span>
    ) : null;
  const overdue = isOverdue(app.next_step_date);

  return (
    <div className="space-y-8">
      <Section title={t.detail.sections.job}>
        <Fact label={f.job_url}>
          {app.job_url && (
            <a
              href={app.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {t.detail.openJob}
              <ArrowUpRightIcon className="size-3.5" />
            </a>
          )}
        </Fact>
        <Fact label={f.source}>
          {app.source && t.options.source[app.source]}
        </Fact>
        <Fact label={f.work_model}>
          {app.work_model && t.options.work_model[app.work_model]}
        </Fact>
        <Fact label={f.workation}>{app.workation}</Fact>
        <Fact label={f.salary_range}>{app.salary_range}</Fact>
      </Section>

      <Section title={t.detail.sections.application}>
        <Fact label={f.applied_at}>{date(app.applied_at)}</Fact>
        <Fact label={f.cv_version}>{app.cv_version}</Fact>
        <Fact label={f.fit_score}>
          {app.fit_score !== null && (
            <span className="font-mono text-[13px] tabular-nums">
              {app.fit_score}
            </span>
          )}
        </Fact>
      </Section>

      <Section title={t.detail.sections.contact}>
        <Fact label={f.contact_name}>{app.contact_name}</Fact>
        <Fact label={f.contact_email}>
          {app.contact_email && (
            <a
              href={`mailto:${app.contact_email}`}
              className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {app.contact_email}
            </a>
          )}
        </Fact>
      </Section>

      <Section title={t.detail.sections.nextStep}>
        <Fact label={f.next_step}>{app.next_step}</Fact>
        <Fact label={f.next_step_date}>
          {app.next_step_date && (
            <span className={cn(overdue && "font-medium text-destructive")}>
              {date(app.next_step_date)}
              {overdue && ` · ${t.pages.board.overdue}`}
            </span>
          )}
        </Fact>
      </Section>

      <Section title={t.detail.sections.notes}>
        <p
          className={cn(
            "py-3 whitespace-pre-wrap",
            !app.notes && "text-muted-foreground"
          )}
        >
          {app.notes ?? "–"}
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="label-caps border-b pb-2">{title}</h2>
      <dl className="divide-y">{children}</dl>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  const empty = children === null || children === undefined || children === "";
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">
        {empty ? <span className="text-muted-foreground">–</span> : children}
      </dd>
    </div>
  );
}

// ---------- History ----------

function History({
  applicationId,
  events,
}: {
  applicationId: string;
  events: ApplicationEvent[];
}) {
  const t = useT();
  return (
    <section>
      <h2 className="label-caps border-b pb-2">
        {t.detail.sections.history}
      </h2>

      {events.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          {t.detail.history.empty}
        </p>
      ) : (
        <ol className="relative mt-4 space-y-5 pl-5 before:absolute before:top-2 before:bottom-2 before:left-[3px] before:w-px before:bg-border">
          {events.map((e) => (
            <EventItem key={e.id} event={e} />
          ))}
        </ol>
      )}

      <AddEventForm applicationId={applicationId} />
    </section>
  );
}

function EventItem({ event: e }: { event: ApplicationEvent }) {
  const t = useT();
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute top-[7px] -left-5 size-[7px] rounded-full bg-foreground ring-4 ring-background"
      />
      <div className="flex flex-wrap items-baseline gap-x-3">
        <p className="font-medium tracking-[-0.02em]">
          {t.options.event_type[e.type]}
        </p>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {formatDate(e.date, t.locale)}
        </p>
      </div>
      {e.from_status && e.to_status && (
        <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px]">
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status={e.from_status} />
            {t.options.status[e.from_status]}
          </span>
          <ArrowRightIcon className="size-3 text-muted-foreground" />
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status={e.to_status} />
            {t.options.status[e.to_status]}
          </span>
        </p>
      )}
      {e.note && (
        <p className="mt-1 text-[13px] leading-[18px] whitespace-pre-wrap text-muted-foreground">
          {e.note}
        </p>
      )}
    </li>
  );
}

function AddEventForm({ applicationId }: { applicationId: string }) {
  const t = useT();
  const [type, setType] = useState<EventType>("note");
  const [date, setDate] = useState(todayISO);
  const [note, setNote] = useState("");
  const [dateError, setDateError] = useState(false);
  const h = t.detail.history;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date) {
      setDateError(true);
      return;
    }
    addEvent({
      application_id: applicationId,
      type,
      date,
      note: note.trim() === "" ? null : note.trim(),
    });
    setNote("");
    setDateError(false);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="mt-6 grid gap-3 rounded-2xl bg-muted/60 p-4 sm:grid-cols-2"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="event-type">{h.type}</Label>
        <Select<EventType>
          items={t.options.event_type}
          value={type}
          onValueChange={(v) => v && setType(v)}
        >
          <SelectTrigger id="event-type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((key) => (
              <SelectItem key={key} value={key}>
                {t.options.event_type[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="event-date">{h.date}</Label>
        <Input
          id="event-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-invalid={dateError || undefined}
          aria-describedby={dateError ? "event-date-error" : undefined}
        />
        {dateError && (
          <p id="event-date-error" className="text-sm text-destructive">
            {t.form.errors.required}
          </p>
        )}
      </div>
      <div className="grid gap-1.5 sm:col-span-2">
        <Label htmlFor="event-note">{h.note}</Label>
        <Textarea
          id="event-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={h.notePlaceholder}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit">{h.add}</Button>
      </div>
    </form>
  );
}

// ---------- Delete ----------

function DeleteButton({ application }: { application: Application }) {
  const t = useT();
  const router = useRouter();

  function handleDelete() {
    deleteApplication(application.id);
    router.push("/board");
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        <Trash2Icon />
        {t.detail.delete}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-[-0.03em]">
            {t.detail.deleteTitle}
          </DialogTitle>
          <DialogDescription>
            {t.detail.deleteText(application.company)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.form.cancel}
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            {t.detail.deleteConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
