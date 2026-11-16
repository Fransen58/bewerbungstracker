"use client";

import { PlayIcon, RotateCcwIcon, XIcon } from "lucide-react";
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
// Sample data is always created in the currently active UI language.
import { createDemoData } from "@/lib/demo-data";
import {
  endDemo,
  resetDemo,
  startDemo,
  useAppMode,
  useStorageReady,
} from "@/lib/storage";
import { useT } from "@/lib/i18n";


export function StartDemoButton({
  variant = "secondary",
}: {
  variant?: "secondary" | "link";
}) {
  const t = useT();
  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={() => startDemo(() => createDemoData(t.demo))}
        className="underline decoration-border underline-offset-4 transition-colors duration-200 ease-soft hover:text-foreground hover:decoration-foreground"
      >
        {t.demo.startFooter}
      </button>
    );
  }
  return (
    <Button variant="secondary" onClick={() => startDemo(() => createDemoData(t.demo))}>
      <PlayIcon />
      {t.demo.start}
    </Button>
  );
}

// Footer entry point; hidden while the demo is already running.
export function FooterDemoLink() {
  const mode = useAppMode();
  const ready = useStorageReady();
  if (!ready || mode === "demo") return null;
  return <StartDemoButton variant="link" />;
}

// Clearly visible bar above the header while demo mode is active.
export function DemoBanner() {
  const t = useT();
  const mode = useAppMode();
  if (mode !== "demo") return null;

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-[13px] md:px-8">
        <p className="flex items-center gap-2 font-medium">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-status-offer"
          />
          {t.demo.banner}
        </p>
        <div className="flex items-center gap-1">
          <ResetDemoButton />
          <button
            type="button"
            onClick={endDemo}
            className="inline-flex h-7 items-center gap-1.5 rounded-full px-3 font-medium transition-colors duration-200 ease-soft hover:bg-primary-foreground/15"
          >
            <XIcon className="size-3.5" />
            {t.demo.end}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResetDemoButton() {
  const t = useT();
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1.5 rounded-full px-3 font-medium transition-colors duration-200 ease-soft hover:bg-primary-foreground/15"
          />
        }
      >
        <RotateCcwIcon className="size-3.5" />
        {t.demo.reset}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-[-0.03em]">
            {t.demo.resetTitle}
          </DialogTitle>
          <DialogDescription>{t.demo.resetText}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.form.cancel}
          </DialogClose>
          <DialogClose
            render={<Button />}
            onClick={() => resetDemo(() => createDemoData(t.demo))}
          >
            {t.demo.reset}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
