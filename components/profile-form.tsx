"use client";

import { useEffect, useRef, useState } from "react";
import {
  CircleCheckIcon,
  FileUpIcon,
  InfoIcon,
  LoaderCircleIcon,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  setProfile,
  useAppData,
  useAppMode,
  useStorageReady,
} from "@/lib/storage";
import { useT } from "@/lib/i18n";
import type { Messages } from "@/messages";

// Same limit as the server (lib/cv.ts); checked here to skip a useless upload.
const MAX_CV_BYTES = 4 * 1024 * 1024;

type CvError = keyof Messages["profile"]["cv"]["errors"];
type CvState =
  | { kind: "idle" | "loading" | "success" }
  | { kind: "error"; code: CvError };

// Story 12: the user's own profile, stored once and used for fit assessments.
export function ProfileForm() {
  const ready = useStorageReady();
  const mode = useAppMode();
  // The editor mounts only once browser data is available, so it starts
  // with the stored profile; switching demo mode remounts it.
  return ready ? <ProfileEditor key={mode} /> : null;
}

function ProfileEditor() {
  const t = useT();
  const p = t.profile;
  const { profile } = useAppData();
  const [value, setValue] = useState(profile ?? "");
  const [saved, setSaved] = useState(false);
  const [cv, setCv] = useState<CvState>({ kind: "idle" });
  // Text read from a CV, waiting for confirmation to replace the field.
  const [pending, setPending] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const unsaved = value.trim() !== (profile ?? "");
  useLeaveWarning(unsaved, p.unsaved);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfile(value);
    setSaved(true);
  }

  function applyCv(text: string) {
    setValue(text);
    setSaved(false);
    setPending(null);
    setCv({ kind: "success" });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;
    if (file.size > MAX_CV_BYTES) {
      setCv({ kind: "error", code: "tooLarge" });
      return;
    }

    setCv({ kind: "loading" });
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/cv", { method: "POST", body });
      const data = await response.json();
      if (!response.ok || !data.profile) {
        const code = data.error in p.cv.errors ? data.error : "aiFailed";
        setCv({ kind: "error", code });
        return;
      }
      if (value.trim() === "") applyCv(data.profile);
      else {
        setPending(data.profile);
        setCv({ kind: "idle" });
      }
    } catch {
      setCv({ kind: "error", code: "aiFailed" });
    }
  }

  const loading = cv.kind === "loading";
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <p className="text-muted-foreground">{p.intro}</p>

      <div className="grid gap-3 rounded-2xl bg-muted/60 p-4">
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFile}
          className="hidden"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={loading}
            onClick={() => fileInput.current?.click()}
          >
            {loading ? <LoaderCircleIcon className="animate-spin" /> : <FileUpIcon />}
            {loading ? p.cv.loading : p.cv.button}
          </Button>
          <p className="text-sm text-muted-foreground">{p.cv.hint}</p>
        </div>
        {cv.kind === "success" && (
          <p role="status" className="text-sm text-muted-foreground">
            {p.cv.success}
          </p>
        )}
        {cv.kind === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {p.cv.errors[cv.code]}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="profile">{p.label}</Label>
        <Textarea
          id="profile"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder={p.placeholder}
          rows={14}
          className="min-h-72"
        />
      </div>
      <div className="flex gap-3 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <p>{p.privacy}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit">{p.save}</Button>
        {saved && (
          <p role="status" className="flex items-center gap-1.5 text-sm text-success">
            <CircleCheckIcon className="size-4" />
            {p.saved}
          </p>
        )}
      </div>

      <Dialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-medium tracking-[-0.03em]">
              {p.cv.replaceTitle}
            </DialogTitle>
            <DialogDescription>{p.cv.replaceText}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t.form.cancel}
            </DialogClose>
            <Button onClick={() => pending && applyCv(pending)}>
              {p.cv.replaceConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

// While there are unsaved changes, asks before the page is left: on reload
// or closing the tab (browser dialog) and on clicks on links inside the app.
function useLeaveWarning(active: boolean, message: string) {
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    // Capture phase on document runs before Next.js handles the link click.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      if (link.origin !== window.location.origin) return;
      if (!window.confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [active, message]);
}
