"use client";

import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "@/components/profile-form";
import { useT } from "@/lib/i18n";

export default function ProfilePage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t.profile.title} />
      <ProfileForm />
    </>
  );
}
