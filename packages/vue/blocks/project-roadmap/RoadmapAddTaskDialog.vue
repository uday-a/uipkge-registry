<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { GanttTask } from '@/components/ui/gantt'

const props = defineProps<{
  open: boolean
}>()

const emits = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'add-task', task: GanttTask): void
}>()

const name = ref('')
const startDate = ref('2026-08-20')
const endDate = ref('2026-08-28')
const status = ref<'todo' | 'in-progress' | 'done'>('todo')
const progress = ref(0)
const isMilestone = ref(false)
const assigneeName = ref('Marcus Rivera')

function handleSubmit() {
  if (!name.value.trim()) return

  const newTask: GanttTask = {
    id: `task-${Date.now()}`,
    name: name.value.trim(),
    startDate: startDate.value,
    endDate: isMilestone.value ? startDate.value : endDate.value,
    status: status.value,
    progress: isMilestone.value ? 100 : Number(progress.value) || 0,
    isMilestone: isMilestone.value,
    assignee: {
      name: assigneeName.value,
      initials: assigneeName.value
        .split(' ')
        .map((p) => p[0])
        .join(''),
    },
  }

  emits('add-task', newTask)
  emits('update:open', false)

  // Reset form
  name.value = ''
  progress.value = 0
  isMilestone.value = false
}
</script>

<template>
  <Dialog data-slot="project-roadmap" :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-[480px] sm:max-w-full">
      <DialogHeader>
        <DialogTitle>Add Roadmap Task</DialogTitle>
        <DialogDescription>
          Create a new scheduled deliverable or critical milestone in the project Gantt timeline.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4 py-2">
        <!-- Task Name -->
        <div class="space-y-1.5">
          <Label for="task-name">Task Name</Label>
          <Input id="task-name" v-model="name" placeholder="e.g. Design Token Hierarchy & Specs" required />
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="start-date">Start Date</Label>
            <Input id="start-date" v-model="startDate" type="date" required />
          </div>
          <div class="space-y-1.5">
            <Label for="end-date">End Date</Label>
            <Input id="end-date" v-model="endDate" type="date" :disabled="isMilestone" required />
          </div>
        </div>

        <!-- Milestone toggle -->
        <div class="border-border/80 bg-muted/20 flex items-center space-x-2 rounded-md border p-3">
          <Checkbox id="milestone-toggle" v-model:checked="isMilestone" />
          <div class="grid gap-0.5 leading-none">
            <label for="milestone-toggle" class="text-foreground cursor-pointer text-xs font-semibold select-none">
              Key Project Milestone
            </label>
            <p class="text-muted-foreground text-xs">
              Marks a zero-duration target deliverable (e.g. Beta Release, Audit sign-off)
            </p>
          </div>
        </div>

        <!-- Status & Assignee -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label>Initial Status</Label>
            <Select v-model="status">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1.5">
            <Label>Assignee</Label>
            <Select v-model="assigneeName">
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Marcus Rivera">Marcus Rivera</SelectItem>
                <SelectItem value="Sarah Connor">Sarah Connor</SelectItem>
                <SelectItem value="Priya Nair">Priya Nair</SelectItem>
                <SelectItem value="Sundar Krishnan">Sundar Krishnan</SelectItem>
                <SelectItem value="Diane Cho">Diane Cho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter class="pt-4">
          <Button variant="outline" type="button" @click="$emit('update:open', false)"> Cancel </Button>
          <Button type="submit">
            <Plus class="mr-1.5 size-3.5" />
            Create Task
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
