"use client";

import { useState } from "react";
import { CircleCheckIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  setProfile,
  useAppData,
  useAppMode,
  useStorageReady,
} from "@/lib/storage";
import { useT } from "@/lib/i18n";

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfile(value);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <p className="text-muted-foreground">{p.intro}</p>
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
    </form>
  );
}
