<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import type { KanbanTask, KanbanColumn } from '@/composables/useKanban'
import { priorityConfig, assignees, tagPresets } from '@/composables/useKanban'
import {
  Dialog,
  DialogScrollContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Plus, X, CheckCircle2, CalendarIcon } from 'lucide-vue-next'
import { getLocalTimeZone, DateFormatter } from '@internationalized/date'
import type { DateValue } from 'reka-ui'

const props = defineProps<{
  open: boolean
  columns: KanbanColumn[]
  initialColumnId: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  create: [columnId: string, tasks: KanbanTask[]]
}>()

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

const columnId = ref(props.initialColumnId)
const dueDate = shallowRef<DateValue | undefined>(undefined)
const form = ref({
  title: '',
  description: '',
  priority: 'medium' as KanbanTask['priority'],
  assigneeKey: 'alice' as keyof typeof assignees,
  tagKeys: [] as (keyof typeof tagPresets)[],
  subtaskTexts: [] as string[],
})
const newSubtaskText = ref('')

watch(
  () => props.initialColumnId,
  (val) => {
    columnId.value = val
  },
)

watch(
  () => props.open,
  (val) => {
    if (val) {
      columnId.value = props.initialColumnId
      form.value = {
        title: '',
        description: '',
        priority: 'medium',
        assigneeKey: 'alice',
        tagKeys: [],
        subtaskTexts: [],
      }
      dueDate.value = undefined
      newSubtaskText.value = ''
    }
  },
)

function addSubtask() {
  const text = newSubtaskText.value.trim()
  if (!text) return
  form.value.subtaskTexts.push(text)
  newSubtaskText.value = ''
}

function removeSubtask(index: number) {
  form.value.subtaskTexts.splice(index, 1)
}

function toggleTag(key: keyof typeof tagPresets) {
  const idx = form.value.tagKeys.indexOf(key)
  if (idx >= 0) form.value.tagKeys.splice(idx, 1)
  else form.value.tagKeys.push(key)
}

function submit() {
  if (!form.value.title.trim()) return
  const maxId = props.columns
    .flatMap((c) => c.tasks)
    .reduce((max, t) => {
      const num = parseInt(t.id.replace(/^[A-Z]+-/, ''), 10)
      return num > max ? num : max
    }, 0)
  const idPrefix = props.columns.flatMap((c) => c.tasks)[0]?.id.split('-')[0] ?? 'TASK'
  const parentId = `${idPrefix}-${maxId + 1}`
  const subtaskTasks: KanbanTask[] = form.value.subtaskTexts.map((text, i) => ({
    id: `${idPrefix}-${maxId + 2 + i}`,
    title: text,
    priority: 'medium' as const,
    assignee: assignees[form.value.assigneeKey],
    tags: [],
    parentId,
    subtaskIds: [],
    commentItems: [],
    fileItems: [],
  }))
  const newTask: KanbanTask = {
    id: parentId,
    title: form.value.title.trim(),
    description: form.value.description.trim() || undefined,
    priority: form.value.priority,
    assignee: assignees[form.value.assigneeKey],
    tags: form.value.tagKeys.map((k) => tagPresets[k]),
    dueDate: dueDate.value ? dueDate.value.toString() : undefined,
    subtaskIds: subtaskTasks.map((t) => t.id),
    commentItems: [],
    fileItems: [],
  }
  emit('create', columnId.value, [newTask, ...subtaskTasks])
  emit('update:open', false)
}
</script>

<template>
  <Dialog data-slot="kanban-board" :open="open" @update:open="$emit('update:open', $event)">
    <DialogScrollContent class="max-w-[680px] sm:max-w-full">
      <DialogHeader>
        <DialogTitle>New Task</DialogTitle>
        <DialogDescription>
          Adding task to
          {{ columns.find((c) => c.id === columnId)?.title ?? 'column' }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-2">
        <div class="grid gap-1.5">
          <Label for="task-title">Title</Label>
          <Input id="task-title" v-model="form.title" placeholder="Enter task title" />
        </div>

        <div class="grid gap-1.5">
          <Label>
            Description
            <span class="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <RichTextEditor v-model="form.description" />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="grid gap-1.5">
            <Label for="task-priority">Priority</Label>
            <Select v-model="form.priority">
              <SelectTrigger id="task-priority">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(config, key) in priorityConfig" :key="key" :value="key">
                  {{ config.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-1.5">
            <Label for="task-assignee">Assignee</Label>
            <Select v-model="form.assigneeKey">
              <SelectTrigger id="task-assignee">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(person, key) in assignees" :key="key" :value="key">
                  {{ person.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-1.5">
            <Label for="task-column">Column</Label>
            <Select v-model="columnId">
              <SelectTrigger id="task-column">
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="col in columns" :key="col.id" :value="col.id">
                  {{ col.title }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid gap-1.5">
          <Label>
            Due Date
            <span class="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="['w-full justify-start text-left font-normal', !dueDate && 'text-muted-foreground']"
              >
                <CalendarIcon class="mr-2 size-4" />
                {{ dueDate ? df.format(dueDate.toDate(getLocalTimeZone())) : 'Pick a date' }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="dueDate" initial-focus />
            </PopoverContent>
          </Popover>
        </div>

        <div class="grid gap-1.5">
          <Label>
            Tags
            <span class="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(tag, key) in tagPresets"
              :key="key"
              type="button"
              :class="[
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                form.tagKeys.includes(key as keyof typeof tagPresets)
                  ? 'bg-primary text-primary-foreground border-transparent'
                  : 'border-border bg-background text-foreground hover:bg-muted',
              ]"
              @click="toggleTag(key as keyof typeof tagPresets)"
            >
              <CheckCircle2 v-if="form.tagKeys.includes(key as keyof typeof tagPresets)" class="size-3" />
              {{ tag.label }}
            </button>
          </div>
        </div>

        <div class="grid gap-1.5">
          <Label>
            Subtasks
            <span class="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <div v-if="form.subtaskTexts.length" class="space-y-2">
            <div v-for="(text, index) in form.subtaskTexts" :key="index" class="flex items-center gap-2">
              <span class="flex-1 text-sm">{{ text }}</span>
              <Button
                variant="ghost"
                size="icon"
                class="size-6"
                aria-label="Remove subtask"
                @click="removeSubtask(index)"
              >
                <X class="size-3" />
              </Button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Input v-model="newSubtaskText" placeholder="Add a subtask" @keyup.enter="addSubtask" />
            <Button variant="outline" size="icon" aria-label="Add subtask" @click="addSubtask">
              <Plus class="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">Cancel</Button>
        <Button :disabled="!form.title.trim()" @click="submit">Create Task</Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
