// Temporary page body until the real views are built in later stories.
export function PagePlaceholder({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
