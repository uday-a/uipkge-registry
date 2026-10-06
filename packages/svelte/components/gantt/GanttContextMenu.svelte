<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { GanttTask, GanttTaskPriority, GanttTaskStatus } from './types'

  export interface GanttContextMenuProps {
    task: GanttTask
    children?: Snippet
    onedit?: (task: GanttTask) => void
    onstatuschange?: (task: GanttTask, status: GanttTaskStatus) => void
    onprioritychange?: (task: GanttTask, priority: GanttTaskPriority) => void
    onduplicate?: (task: GanttTask) => void
    ondelete?: (task: GanttTask) => void
  }
</script>

<script lang="ts">
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
  } from '$lib/components/ui/context-menu'
  import { Clock, Copy, Edit2, Flag, Layers, Trash2 } from '@lucide/svelte'

  let {
    task,
    onedit,
    onstatuschange,
    onprioritychange,
    onduplicate,
    ondelete,
    children,
  }: GanttContextMenuProps = $props()

  function copyTaskId() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(task.id)
    }
  }
</script>

<ContextMenu>
  <!-- The Vue twin uses as-child here; without a render-prop contract on the
       Svelte Trigger yet, nest the trigger content in the default element. -->
  <ContextMenuTrigger>
    {@render children?.()}
  </ContextMenuTrigger>
  <ContextMenuContent class="w-56">
    <ContextMenuLabel class="flex items-center justify-between text-xs">
      <span class="truncate font-semibold">{task.name}</span>
      <span class="text-muted-foreground font-mono text-xs">{task.id}</span>
    </ContextMenuLabel>
    <ContextMenuSeparator />

    <!-- Edit / Inspect -->
    <ContextMenuItem onSelect={() => onedit?.(task)}>
      <Edit2 class="mr-2 size-3.5" />
      <span>View Details</span>
      <ContextMenuShortcut>↵</ContextMenuShortcut>
    </ContextMenuItem>

    <!-- Status Submenu -->
    <ContextMenuSub>
      <ContextMenuSubTrigger>
        <Clock class="text-primary mr-2 size-3.5" />
        <span>Change Status</span>
      </ContextMenuSubTrigger>
      <ContextMenuSubContent class="w-44">
        <ContextMenuRadioGroup
          value={task.status ?? 'todo'}
          onValueChange={(v) => onstatuschange?.(task, v as GanttTaskStatus)}
        >
          <ContextMenuRadioItem value="done">
            <span class="mr-2 size-2 rounded-full bg-emerald-500"></span>
            <span>Completed</span>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="in-progress">
            <span class="bg-primary mr-2 size-2 rounded-full"></span>
            <span>In Progress</span>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="at-risk">
            <span class="mr-2 size-2 rounded-full bg-amber-500"></span>
            <span>At Risk</span>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="blocked">
            <span class="bg-destructive mr-2 size-2 rounded-full"></span>
            <span>Blocked</span>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="todo">
            <span class="bg-muted-foreground/40 mr-2 size-2 rounded-full"></span>
            <span>To Do</span>
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>

    <!-- Priority Submenu -->
    <ContextMenuSub>
      <ContextMenuSubTrigger>
        <Flag class="mr-2 size-3.5 text-amber-500" />
        <span>Set Priority</span>
      </ContextMenuSubTrigger>
      <ContextMenuSubContent class="w-40">
        <ContextMenuRadioGroup
          value={task.priority ?? 'medium'}
          onValueChange={(v) => onprioritychange?.(task, v as GanttTaskPriority)}
        >
          <ContextMenuRadioItem value="urgent">
            <Flag class="text-destructive mr-2 size-3" />
            <span>Urgent</span>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="high">
            <Flag class="mr-2 size-3 text-amber-500" />
            <span>High</span>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="medium">
            <Flag class="text-primary mr-2 size-3" />
            <span>Medium</span>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="low">
            <Flag class="text-muted-foreground mr-2 size-3" />
            <span>Low</span>
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>

    <ContextMenuSeparator />

    <!-- Copy ID -->
    <ContextMenuItem onSelect={copyTaskId}>
      <Copy class="mr-2 size-3.5" />
      <span>Copy Task ID</span>
      <ContextMenuShortcut>⌘C</ContextMenuShortcut>
    </ContextMenuItem>

    <!-- Duplicate -->
    <ContextMenuItem onSelect={() => onduplicate?.(task)}>
      <Layers class="mr-2 size-3.5" />
      <span>Duplicate</span>
      <ContextMenuShortcut>⌘D</ContextMenuShortcut>
    </ContextMenuItem>

    <ContextMenuSeparator />

    <!-- Delete -->
    <ContextMenuItem class="text-destructive focus:text-destructive" onSelect={() => ondelete?.(task)}>
      <Trash2 class="mr-2 size-3.5" />
      <span>Delete Deliverable</span>
      <ContextMenuShortcut>⌫</ContextMenuShortcut>
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
