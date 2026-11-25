"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  DownloadIcon,
  InfoIcon,
  UploadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBackup, parseBackup, type BackupError } from "@/lib/backup";
import { todayISO } from "@/lib/date";
import {
  replaceAppData,
  useAppData,
  useAppMode,
  useStorageReady,
  type AppData,
} from "@/lib/storage";
import { useT } from "@/lib/i18n";
import type { Messages } from "@/messages";

// Field names in error messages use the form labels where they exist.
function fieldLabel(t: Messages, field: string): string {
  const labels: Record<string, string> = {
    ...t.form.fields,
    type: t.detail.history.type,
    date: t.detail.history.date,
    note: t.detail.history.note,
  };
  return labels[field] ?? field;
}

function errorMessage(t: Messages, error: BackupError): string {
  const e = t.backup.errors;
  switch (error.code) {
    case "invalidApplication":
      return e.invalidApplication(error.index + 1, fieldLabel(t, error.field));
    case "invalidEvent":
      return error.field === "application_id"
        ? e.orphanEvent(error.index + 1)
        : e.invalidEvent(error.index + 1, fieldLabel(t, error.field));
    default:
      return e[error.code];
  }
}

// Stores the data of a message, not its text, so it follows language switches.
// A success message belongs to the imported data and disappears once that
// data is replaced (demo reset, switching between demo and real data).
type Message =
  | { kind: "success"; count: number; data: AppData }
  | { kind: "error"; error: BackupError };

export function BackupPanel() {
  const t = useT();
  const data = useAppData();
  const ready = useStorageReady();
  const mode = useAppMode();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<AppData | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const b = t.backup;

  function handleExport() {
    const json = JSON.stringify(createBackup(data), null, 2);
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `bewerbungstracker-backup-${todayISO()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;

    const result = parseBackup(await file.text());
    if (!result.ok) {
      setMessage({ kind: "error", error: result.error });
      return;
    }
    setMessage(null);
    setPending(result.data);
  }

  function confirmImport() {
    if (!pending) return;
    replaceAppData(pending);
    setMessage({ kind: "success", count: pending.applications.length, data: pending });
    setPending(null);
  }

  if (!ready) return null;
  const shown =
    message?.kind === "success" && message.data !== data ? null : message;

  return (
    <div className="max-w-2xl space-y-10">
      <div className="flex gap-3 rounded-2xl bg-muted/60 p-4">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="font-medium tracking-[-0.02em]">{b.hintTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{b.hint}</p>
          {mode === "demo" && (
            <p className="mt-2 text-sm font-medium">{b.demoHint}</p>
          )}
        </div>
      </div>

      <Section title={b.exportTitle}>
        <p className="text-sm text-muted-foreground">
          {b.exportText(data.applications.length, data.events.length)}
        </p>
        <Button onClick={handleExport}>
          <DownloadIcon />
          {b.exportButton}
        </Button>
      </Section>

      <Section title={b.importTitle}>
        <p className="text-sm text-muted-foreground">{b.importText}</p>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
        <Button variant="secondary" onClick={() => fileInput.current?.click()}>
          <UploadIcon />
          {b.importButton}
        </Button>

        {shown && (
          <div
            role={shown.kind === "error" ? "alert" : "status"}
            className={
              shown.kind === "error"
                ? "flex gap-2 text-sm text-destructive"
                : "flex gap-2 text-sm text-success"
            }
          >
            {shown.kind === "error" ? (
              <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
            ) : (
              <CircleCheckIcon className="mt-0.5 size-4 shrink-0" />
            )}
            <div>
              {shown.kind === "error" && (
                <p className="font-medium">{b.errorTitle}</p>
              )}
              <p>
                {shown.kind === "error"
                  ? errorMessage(t, shown.error)
                  : b.success(shown.count)}
              </p>
            </div>
          </div>
        )}
      </Section>

      <Dialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-medium tracking-[-0.03em]">
              {b.confirmTitle}
            </DialogTitle>
            <DialogDescription>
              {pending &&
                b.confirmText(
                  data.applications.length,
                  pending.applications.length
                )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t.form.cancel}
            </DialogClose>
            <Button variant="destructive" onClick={confirmImport}>
              {b.confirmButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="label-caps border-b pb-2">{title}</h2>
      <div className="mt-4 flex flex-col items-start gap-4">{children}</div>
    </section>
  );
}
