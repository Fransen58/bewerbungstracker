"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { cn } from "@/lib/utils";

// Story 18: a text field that suggests earlier values while typing; any
// other text can still be entered. Looks like the app's Input and Select.
export function SuggestInput({
  suggestions,
  defaultValue,
  className,
  ...input
}: {
  suggestions: string[];
  defaultValue: string;
  className?: string;
} & Omit<React.ComponentProps<"input">, "defaultValue">) {
  return (
    <Autocomplete.Root items={suggestions} defaultValue={defaultValue}>
      <Autocomplete.Input
        {...input}
        className={cn(
          "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
          className
        )}
      />
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4} className="isolate z-50">
          <Autocomplete.Popup className="max-h-[min(var(--available-height),15rem)] w-(--anchor-width) overflow-y-auto rounded-xl bg-popover p-1 text-popover-foreground shadow-elevated data-empty:hidden">
            <Autocomplete.List>
              {(item: string) => (
                <Autocomplete.Item
                  key={item}
                  value={item}
                  className="flex cursor-default items-center rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  {item}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
