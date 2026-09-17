"use client";

import * as React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit2, Copy, Trash2, Clock, Flag, Layers } from "lucide-react";
import type { GanttTask, GanttTaskStatus, GanttTaskPriority } from "./types";

export interface GanttContextMenuProps {
  task: GanttTask;
  onEdit?: (task: GanttTask) => void;
  onStatusChange?: (task: GanttTask, status: GanttTaskStatus) => void;
  onPriorityChange?: (task: GanttTask, priority: GanttTaskPriority) => void;
  onDuplicate?: (task: GanttTask) => void;
  onDelete?: (task: GanttTask) => void;
  children: React.ReactNode;
}

export function GanttContextMenu({
  task,
  onEdit,
  onStatusChange,
  onPriorityChange,
  onDuplicate,
  onDelete,
  children,
}: GanttContextMenuProps) {
  const copyTaskId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(task.id);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="flex items-center justify-between text-xs">
          <span className="truncate font-semibold">{task.name}</span>
          <span className="text-muted-foreground font-mono text-xs">
            {task.id}
          </span>
        </ContextMenuLabel>
        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onEdit?.(task)}>
          <Edit2 className="mr-2 size-3.5" />
          <span>View Details</span>
          <ContextMenuShortcut>↵</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Clock className="text-primary mr-2 size-3.5" />
            <span>Change Status</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuRadioGroup value={task.status ?? "todo"}>
              <ContextMenuRadioItem
                value="done"
                onClick={() => onStatusChange?.(task, "done")}
              >
                <span className="mr-2 size-2 rounded-full bg-emerald-500" />
                <span>Completed</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="in-progress"
                onClick={() => onStatusChange?.(task, "in-progress")}
              >
                <span className="bg-primary mr-2 size-2 rounded-full" />
                <span>In Progress</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="at-risk"
                onClick={() => onStatusChange?.(task, "at-risk")}
              >
                <span className="mr-2 size-2 rounded-full bg-amber-500" />
                <span>At Risk</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="blocked"
                onClick={() => onStatusChange?.(task, "blocked")}
              >
                <span className="bg-destructive mr-2 size-2 rounded-full" />
                <span>Blocked</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="todo"
                onClick={() => onStatusChange?.(task, "todo")}
              >
                <span className="bg-muted-foreground/40 mr-2 size-2 rounded-full" />
                <span>To Do</span>
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Flag className="mr-2 size-3.5 text-amber-500" />
            <span>Set Priority</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-40">
            <ContextMenuRadioGroup value={task.priority ?? "medium"}>
              <ContextMenuRadioItem
                value="urgent"
                onClick={() => onPriorityChange?.(task, "urgent")}
              >
                <Flag className="text-destructive mr-2 size-3" />
                <span>Urgent</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="high"
                onClick={() => onPriorityChange?.(task, "high")}
              >
                <Flag className="mr-2 size-3 text-amber-500" />
                <span>High</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="medium"
                onClick={() => onPriorityChange?.(task, "medium")}
              >
                <Flag className="text-primary mr-2 size-3" />
                <span>Medium</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem
                value="low"
                onClick={() => onPriorityChange?.(task, "low")}
              >
                <Flag className="text-muted-foreground mr-2 size-3" />
                <span>Low</span>
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={copyTaskId}>
          <Copy className="mr-2 size-3.5" />
          <span>Copy Task ID</span>
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => onDuplicate?.(task)}>
          <Layers className="mr-2 size-3.5" />
          <span>Duplicate</span>
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete?.(task)}
        >
          <Trash2 className="mr-2 size-3.5" />
          <span>Delete Deliverable</span>
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
