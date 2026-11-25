"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { de, enUS } from "react-day-picker/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate, fromISODay, toISODay, todayISO } from "@/lib/date";
import { useLang, useT } from "@/lib/i18n";

const LOCALES = { de, en: enUS };

// Story 16: date field in the app's style instead of the browser's own
// picker. Values stay ISO days (YYYY-MM-DD). With `name` it also writes a
// hidden input, so plain forms (FormData) keep working. Controlled via
// `value`/`onChange`, otherwise it starts from `defaultValue`.
export function DatePicker({
  id,
  name,
  value,
  defaultValue = null,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  name?: string;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const t = useT();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState<string | null>(defaultValue);
  const current = value !== undefined ? value : inner;

  function choose(next: string | null) {
    setInner(next);
    onChange?.(next);
    setOpen(false);
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={current ?? ""} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-left text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
            current ? "font-mono tabular-nums" : "text-muted-foreground"
          )}
        >
          {current ? formatDate(current, t.locale) : t.datePicker.placeholder}
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto rounded-xl p-2 shadow-elevated ring-0"
          // Start on the chosen day (or today), so arrow keys move days.
          initialFocus={() =>
            document.querySelector<HTMLElement>(
              "[data-slot=popover-content] .rdp-day[data-selected] button, [data-slot=popover-content] .rdp-today button"
            )
          }
        >
          <Calendar
            mode="single"
            // Always six week rows, so the popup keeps its size per month.
            fixedWeeks
            locale={LOCALES[lang]}
            selected={current ? fromISODay(current) : undefined}
            defaultMonth={current ? fromISODay(current) : undefined}
            onSelect={(d) => d && choose(toISODay(d))}
            className="[--cell-radius:9999px] [--cell-size:--spacing(9)]"
          />
          <div className="flex justify-between gap-2 border-t px-1 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => choose(todayISO())}
            >
              {t.datePicker.today}
            </Button>
            {current && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => choose(null)}
              >
                {t.datePicker.clear}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
