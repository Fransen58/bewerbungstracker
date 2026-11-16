"use client";

import { useState, type SyntheticEvent } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, isOverdue } from "@/lib/date";
import { changeStatus, useAppData } from "@/lib/storage";
import { STATUSES, type Application, type Status } from "@/lib/types";
import { t } from "@/messages";

export function Board() {
  const { applications } = useAppData();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Mouse drags start after moving 5px, touch drags after a short press,
  // so clicks and scrolling keep working.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        {t.empty.applications}
      </div>
    );
  }

  const byId = new Map(applications.map((a) => [a.id, a]));
  const active = activeId ? byId.get(activeId) : undefined;

  const company = (id: string | number) => byId.get(String(id))?.company ?? "";
  const column = (id: string | number) => t.options.status[id as Status];
  const announcements: Announcements = {
    onDragStart: ({ active }) => t.pages.board.announce.start(company(active.id)),
    onDragOver: ({ active, over }) =>
      over ? t.pages.board.announce.over(company(active.id), column(over.id)) : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? t.pages.board.announce.end(company(active.id), column(over.id))
        : t.pages.board.announce.cancel(company(active.id)),
    onDragCancel: ({ active }) => t.pages.board.announce.cancel(company(active.id)),
  };

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (e.over) changeStatus(String(e.active.id), e.over.id as Status);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: t.pages.board.dragInstructions },
      }}
    >
      {/* Horizontal scroll on all screen sizes; one column per status. */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            applications={applications.filter((a) => a.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {active && <CardBody application={active} className="shadow-lg" />}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  status,
  applications,
}: {
  status: Status;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-label={t.options.status[status]}
      className={cn(
        "flex w-72 shrink-0 flex-col gap-2 rounded-xl bg-muted/50 p-2 transition-colors",
        isOver && "bg-muted ring-2 ring-ring/40"
      )}
    >
      <h2 className="flex items-center justify-between px-1 pt-1 text-sm font-medium">
        {t.options.status[status]}
        <span className="text-xs text-muted-foreground">
          {applications.length}
        </span>
      </h2>
      <div className="flex min-h-24 flex-col gap-2">
        {applications.map((app) => (
          <DraggableCard key={app.id} application={app} />
        ))}
      </div>
    </section>
  );
}

function DraggableCard({ application }: { application: Application }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: application.id,
  });

  // Keep interactions with the status select from starting a drag.
  const stop = (e: SyntheticEvent) => e.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isDragging && "opacity-40"
      )}
    >
      <CardBody application={application}>
        <div onMouseDown={stop} onTouchStart={stop} onKeyDown={stop}>
          <StatusSelect application={application} />
        </div>
      </CardBody>
    </div>
  );
}

function CardBody({
  application: app,
  className,
  children,
}: {
  application: Application;
  className?: string;
  children?: React.ReactNode;
}) {
  const overdue = isOverdue(app.next_step_date);

  return (
    <article
      className={cn(
        "flex cursor-grab flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground",
        overdue && "border-destructive",
        className
      )}
    >
      <div>
        <p className="font-medium leading-snug">{app.company}</p>
        <p className="text-sm text-muted-foreground">{app.role}</p>
      </div>

      {app.work_model && (
        <span className="w-fit rounded-md bg-muted px-2 py-0.5 text-xs">
          {t.options.work_model[app.work_model]}
        </span>
      )}

      {(app.next_step || app.next_step_date) && (
        <div className="text-sm">
          {app.next_step && <p>{app.next_step}</p>}
          {app.next_step_date && (
            <p
              className={cn(
                "flex items-center gap-1 text-xs text-muted-foreground",
                overdue && "font-medium text-destructive"
              )}
            >
              <CalendarIcon className="size-3" />
              {formatDate(app.next_step_date, t.locale)}
              {overdue && ` · ${t.pages.board.overdue}`}
            </p>
          )}
        </div>
      )}

      {children}
    </article>
  );
}

function StatusSelect({ application }: { application: Application }) {
  return (
    <Select
      items={t.options.status}
      value={application.status}
      onValueChange={(value) => {
        if (value) changeStatus(application.id, value as Status);
      }}
    >
      <SelectTrigger
        size="sm"
        className="w-full"
        aria-label={t.pages.board.changeStatus}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {t.options.status[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
