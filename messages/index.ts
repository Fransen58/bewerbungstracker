import { de, type Messages } from "./de";
import { en } from "./en";

export type { Messages };
export type Lang = "de" | "en";

export const LANGS: readonly Lang[] = ["de", "en"];
export const DEFAULT_LANG: Lang = "de";
export const messages: Record<Lang, Messages> = { de, en };
