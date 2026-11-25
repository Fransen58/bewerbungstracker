// Story 13: what to import from a share. Many apps put the link into a short
// text ("Have a look at this job: https://…"); then the link is what can be
// read. A longer text is likely the ad itself and is imported as it is.
const SHORT_TEXT = 200;

export function sharedJobInput(params: {
  url: string | null;
  text: string | null;
  title: string | null;
}): string | null {
  const url = params.url?.trim();
  if (url) return url;
  const text = params.text?.trim() ?? "";
  const link = text.match(/https?:\/\/[^\s<>"']+/i)?.[0];
  if (link && text.replace(link, "").trim().length < SHORT_TEXT) return link;
  return text || params.title?.trim() || null;
}
