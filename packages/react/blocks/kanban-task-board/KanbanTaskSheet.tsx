'use client'

import { Clock, ExternalLink, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type KanbanColumn as KanbanColumnType, type KanbanTask, priorityConfig, fileIconMap } from '@/lib/use-kanban'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet'
import { TagBadge } from './TagBadge'
import { PriorityBadge } from './PriorityBadge'
import { DueDateBadge } from './DueDateBadge'
import { UserAvatar } from './UserAvatar'
import { SubtaskList } from './SubtaskList'
import { CommentList } from './CommentList'

export function KanbanTaskSheet({
  open,
  task,
  columns,
  onOpenChange,
  onMoveTask,
  onAddComment,
}: {
  open: boolean
  task: KanbanTask | null
  columns: KanbanColumnType[]
  onOpenChange: (value: boolean) => void
  onMoveTask: (task: KanbanTask, columnId: string) => void
  onAddComment: (task: KanbanTask, text: string) => void
}) {
  const columnIdForTask = task ? (columns.find((c) => c.tasks.some((t) => t.id === task.id))?.id ?? '') : ''

  return (
    <Sheet data-slot="kanban-board" open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex max-w-[420px] flex-col gap-0 overflow-hidden p-0 sm:max-w-full">
        {task && (
          <>
            <div className={cn('h-1 w-full shrink-0', priorityConfig[task.priority]?.bg)} />

            <div className="shrink-0 px-5 pt-4 pb-3">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs tracking-tight">{task.id}</span>
                <span className="text-muted-foreground/30">·</span>
                <Select value={columnIdForTask} onValueChange={(val) => onMoveTask(task, String(val))}>
                  <SelectTrigger className="hover:bg-secondary h-5 w-auto gap-1 rounded-md border-none bg-transparent px-1.5 text-xs font-medium shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        <span className="flex items-center gap-1.5">
                          <span className={cn('size-1.5 rounded-full', col.dotColor)} />
                          {col.title}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <PriorityBadge priority={task.priority} iconSize="size-3" className="ml-auto" />
              </div>

              <SheetTitle className="text-sm leading-snug font-semibold tracking-tight">{task.title}</SheetTitle>
              <SheetDescription className="sr-only">Task details</SheetDescription>
              {task.description ? (
                <div
                  className="text-muted-foreground rich-text-content prose prose-sm dark:prose-invert mt-1.5 max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              ) : (
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">No description provided.</p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {task.tags.length ? (
                  task.tags.map((tag) => <TagBadge key={tag.label} label={tag.label} color={tag.color} />)
                ) : (
                  <span className="text-muted-foreground text-xs">No tags</span>
                )}
              </div>
            </div>

            <div className="bg-border mx-5 h-px" />

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4 px-5 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar name={task.assignee.name} color={task.assignee.color} size="md" />
                  <div>
                    <p className="text-sm leading-tight font-medium">{task.assignee.name}</p>
                    <p className="text-muted-foreground text-xs">Assignee</p>
                  </div>
                  <div className="ml-auto text-right">
                    {task.dueDate ? (
                      <DueDateBadge dueDate={task.dueDate} />
                    ) : (
                      <p className="text-muted-foreground flex items-center gap-1 text-sm leading-tight">
                        <Clock className="size-3" />
                        No due date
                      </p>
                    )}
                  </div>
                </div>

                {task.parentId && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Parent:</span>
                    <a
                      href={`/dashboard/kanban/${task.parentId}`}
                      className="text-primary text-xs font-medium hover:underline"
                      onClick={() => onOpenChange(false)}
                    >
                      {task.parentId}
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="mb-2 text-sm font-semibold">
                    Subtasks
                    {task.subtaskIds.length > 0 && (
                      <span className="text-muted-foreground font-normal"> ({task.subtaskIds.length})</span>
                    )}
                  </h4>
                  <SubtaskList subtaskIds={task.subtaskIds} columns={columns} compact />
                </div>

                <div className="bg-border h-px" />

                <div>
                  <h4 className="mb-2 text-sm font-semibold">
                    Comments
                    {task.commentItems.length > 0 && (
                      <span className="text-muted-foreground font-normal"> ({task.commentItems.length})</span>
                    )}
                  </h4>
                  <CommentList comments={task.commentItems} compact onAdd={(text) => onAddComment(task, text)} />
                </div>

                <div className="bg-border h-px" />

                <div>
                  <h4 className="mb-2 text-sm font-semibold">
                    Files
                    {task.fileItems.length > 0 && (
                      <span className="text-muted-foreground font-normal"> ({task.fileItems.length})</span>
                    )}
                  </h4>
                  {task.fileItems.length ? (
                    <div className="space-y-1">
                      {task.fileItems.map((file) => {
                        const FileIcon = fileIconMap[file.type]
                        return (
                          <div
                            key={file.id}
                            className="hover:bg-muted/50 group/file flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors"
                          >
                            <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
                              <FileIcon className="text-muted-foreground size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium">{file.name}</p>
                              <p className="text-muted-foreground text-xs">{file.size}</p>
                            </div>
                            <Button
                              aria-label="Download attachment"
                              variant="ghost"
                              size="icon"
                              className="size-7 shrink-0 opacity-0 transition-opacity group-hover/file:opacity-100"
                            >
                              <Download className="size-3.5" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">No files attached.</p>
                  )}
                </div>
              </div>
            </div>

            <SheetFooter className="shrink-0 border-t px-5 py-3">
              <div className="flex w-full items-center gap-2">
                <a href={`/dashboard/kanban/${task.id}`} className="flex-1" onClick={() => onOpenChange(false)}>
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <ExternalLink className="size-3.5" />
                    View full detail
                  </Button>
                </a>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm">
                    Close
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
