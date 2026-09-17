<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Globe, Link2, Lock } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SectionCard } from '@/components/ui/section-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
  }>(),
  {},
)

const DESCRIPTION_LIMIT = 280

const name = ref('')
const description = ref('')
const visibility = ref('internal')
const startDate = ref('')
const budget = ref('')
const access = ref<'link' | 'restricted'>('link')
const notifications = ref(true)
const comments = ref(true)
const submitted = ref(false)

const slug = computed(() => {
  const cleaned = name.value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned || 'your-project'
})

const showNameError = computed(() => submitted.value && name.value.trim() === '')

function handleSubmit() {
  submitted.value = true
  if (name.value.trim() === '') return
}
</script>

<template>
  <div data-slot="form-layouts" :class="['max-w-2xl', props.class]">
    <form class="space-y-6" novalidate @submit.prevent="handleSubmit">
      <SectionCard title="Project details" description="Name your project and describe what it covers.">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="fl-name">Name</Label>
            <Input
              id="fl-name"
              v-model="name"
              placeholder="Q3 launch site"
              autocomplete="off"
              :aria-invalid="showNameError || undefined"
            />
            <p v-if="showNameError" role="alert" class="text-destructive text-xs">Project name is required.</p>
          </div>
          <div class="border-border bg-muted/40 flex items-center gap-2 rounded-md border px-3 py-2">
            <Globe class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
            <p class="min-w-0 truncate text-xs">
              <span class="text-muted-foreground">acme.uipkge.app/</span>
              <span class="text-foreground font-medium">{{ slug }}</span>
            </p>
          </div>
          <div class="space-y-2">
            <Label for="fl-description">Description</Label>
            <Textarea id="fl-description" v-model="description" :rows="3" placeholder="What is this project about?" />
            <p
              class="text-right text-xs"
              :class="description.length > DESCRIPTION_LIMIT ? 'text-destructive' : 'text-muted-foreground'"
            >
              {{ description.length }}/{{ DESCRIPTION_LIMIT }}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Configuration" description="Visibility, schedule and budget for the project.">
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="space-y-2">
            <Label for="fl-visibility">Visibility</Label>
            <Select v-model="visibility">
              <SelectTrigger id="fl-visibility" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="fl-start-date">Start date</Label>
            <Input id="fl-start-date" v-model="startDate" type="date" />
          </div>
          <div class="space-y-2">
            <Label for="fl-budget">Budget</Label>
            <Input id="fl-budget" v-model="budget" type="number" :min="0" :step="500" class="text-left" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Access" description="Decide who can open the project and what they can do.">
        <div class="space-y-5">
          <RadioGroup v-model="access" class="gap-3">
            <div
              class="hover:bg-accent/50 has-data-[state=checked]:border-primary flex items-start gap-3 rounded-lg border p-3 transition-colors"
            >
              <RadioGroupItem id="fl-access-link" value="link" class="mt-0.5" />
              <label for="fl-access-link" class="cursor-pointer select-none">
                <span class="flex items-center gap-1.5 text-sm font-medium">
                  <Link2 class="size-4" aria-hidden="true" />
                  Anyone with the link
                </span>
                <span class="text-muted-foreground mt-0.5 block text-xs"> Guests can view without signing in. </span>
              </label>
            </div>
            <div
              class="hover:bg-accent/50 has-data-[state=checked]:border-primary flex items-start gap-3 rounded-lg border p-3 transition-colors"
            >
              <RadioGroupItem id="fl-access-restricted" value="restricted" class="mt-0.5" />
              <label for="fl-access-restricted" class="cursor-pointer select-none">
                <span class="flex items-center gap-1.5 text-sm font-medium">
                  <Lock class="size-4" aria-hidden="true" />
                  Restricted
                </span>
                <span class="text-muted-foreground mt-0.5 block text-xs">
                  Only invited members can open the project.
                </span>
              </label>
            </div>
          </RadioGroup>

          <div class="divide-y rounded-lg border">
            <div class="flex items-center justify-between gap-4 p-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Notifications</p>
                <p class="text-muted-foreground mt-0.5 text-xs">Email the team on status changes and mentions.</p>
              </div>
              <Switch v-model="notifications" aria-label="Toggle notifications" />
            </div>
            <div class="flex items-center justify-between gap-4 p-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Comments</p>
                <p class="text-muted-foreground mt-0.5 text-xs">Let viewers comment on tasks and updates.</p>
              </div>
              <Switch v-model="comments" aria-label="Toggle comments" />
            </div>
          </div>
        </div>
      </SectionCard>

      <div
        class="bg-background/80 border-border sticky bottom-0 -mx-1 flex items-center justify-end gap-2 rounded-b-xl border-t px-1 py-4 backdrop-blur"
      >
        <Button type="button" variant="ghost" size="sm">Cancel</Button>
        <Button type="submit" size="sm" :disabled="name.trim() === ''">Create project</Button>
      </div>
    </form>
  </div>
</template>
