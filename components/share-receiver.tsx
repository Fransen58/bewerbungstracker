"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SharedApplicationDialog } from "@/components/application-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { sharedJobInput } from "@/lib/share";
import { useStorageReady } from "@/lib/storage";
import { useT } from "@/lib/i18n";

// Opens "new application" with the shared job and starts its import.
// Whatever happens in the dialog, afterwards the applications page follows.
export function ShareReceiver() {
  const t = useT();
  const params = useSearchParams();
  const router = useRouter();
  // The dialog needs the stored data (profile, CV versions) from the start.
  const ready = useStorageReady();
  if (!ready) return null;

  const input = sharedJobInput({
    url: params.get("url"),
    text: params.get("text"),
    title: params.get("title"),
  });

  return (
    <>
      <PageHeader title={t.share.title} />
      {input ? (
        <SharedApplicationDialog
          input={input}
          onClosed={() => router.replace("/applications")}
        />
      ) : (
        <EmptyState text={t.share.empty}>
          <Button render={<Link href="/applications" />} nativeButton={false}>
            {t.share.toApplications}
          </Button>
        </EmptyState>
      )}
    </>
  );
}
