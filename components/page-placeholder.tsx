import { PageHeader } from "@/components/page-header";

// Temporary page body until the real views are built in later stories.
export function PagePlaceholder({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <>
      <PageHeader title={title} />
      <p className="text-muted-foreground">{text}</p>
    </>
  );
}
