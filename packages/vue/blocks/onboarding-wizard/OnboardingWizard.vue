<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Check, ChevronLeft, ChevronRight, Globe, Plus, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionCard } from '@/components/ui/section-card'
import { Stepper } from '@/components/ui/stepper'
import { Switch } from '@/components/ui/switch'

interface Preference {
  id: string
  label: string
  description: string
  enabled: boolean
}

const props = withDefaults(
  defineProps<{
    /** Jump straight to a step (1 Workspace · 2 Team · 3 Preferences · 4 Done). */
    initialStep?: number
    /** Pre-fill the workspace name so later steps read naturally in isolation. */
    initialWorkspaceName?: string
    /** Pre-seed invited teammates. */
    initialInvites?: string[]
    class?: HTMLAttributes['class']
  }>(),
  {
    initialStep: 1,
    initialWorkspaceName: 'Acme Inc',
    initialInvites: () => [],
  },
)

const steps = [
  { id: 1, title: 'Workspace' },
  { id: 2, title: 'Team' },
  { id: 3, title: 'Preferences' },
  { id: 4, title: 'Done' },
]

const step = ref(props.initialStep)
const workspaceName = ref(props.initialWorkspaceName)
const invites = ref<string[]>([...props.initialInvites])
const inviteDraft = ref('')
const inviteInvalid = ref(false)

const preferences = ref<Preference[]>([
  {
    id: 'digests',
    label: 'Email digests',
    description: 'A daily summary of workspace activity.',
    enabled: true,
  },
  {
    id: 'updates',
    label: 'Product updates',
    description: 'Occasional notes about new features and improvements.',
    enabled: false,
  },
  {
    id: 'reports',
    label: 'Weekly reports',
    description: 'Usage analytics delivered every Monday morning.',
    enabled: true,
  },
])

const slug = computed(() => {
  const cleaned = workspaceName.value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned || 'your-workspace'
})

function addInvite() {
  const email = inviteDraft.value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || invites.value.includes(email)) {
    inviteInvalid.value = true
    return
  }
  inviteInvalid.value = false
  invites.value.push(email)
  inviteDraft.value = ''
}

function removeInvite(email: string) {
  invites.value = invites.value.filter((e) => e !== email)
}

function onStepperInput(value: number) {
  // Free backward navigation; forward goes through the footer button only.
  if (value < step.value && step.value !== 4) step.value = value
}

function goNext() {
  if (step.value < 4) step.value += 1
}

function reset() {
  step.value = 1
  workspaceName.value = ''
  invites.value = []
  inviteDraft.value = ''
}
</script>

<template>
  <SectionCard
    data-slot="onboarding-wizard"
    title="Set up your workspace"
    description="Four quick steps and your team is ready to collaborate."
    :class="props.class"
  >
    <Stepper :steps="steps" :model-value="step" class="mb-6" @update:model-value="onStepperInput" />

    <!-- Step 1 · Workspace -->
    <div v-if="step === 1" class="space-y-4">
      <div class="space-y-2">
        <label for="onboarding-workspace-name" class="text-sm font-medium">Workspace name</label>
        <Input id="onboarding-workspace-name" v-model="workspaceName" placeholder="Acme Inc" autocomplete="off" />
      </div>
      <div class="border-border bg-muted/40 flex items-center gap-2 rounded-md border px-3 py-2">
        <Globe class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        <p class="min-w-0 truncate text-xs">
          <span class="text-muted-foreground">uipkge.dev/</span>
          <span class="text-foreground font-medium">{{ slug }}</span>
        </p>
      </div>
    </div>

    <!-- Step 2 · Team -->
    <div v-else-if="step === 2" class="space-y-4">
      <form class="flex gap-2" @submit.prevent="addInvite">
        <Input
          v-model="inviteDraft"
          type="email"
          placeholder="teammate@company.com"
          :status="inviteInvalid ? 'error' : undefined"
          class="flex-1"
          @input="inviteInvalid = false"
        />
        <Button type="submit" variant="outline" size="sm" class="shrink-0">
          <Plus aria-hidden="true" />
          Add
        </Button>
      </form>
      <p v-if="inviteInvalid" role="alert" class="text-destructive text-xs">Enter a valid email address.</p>
      <div v-if="invites.length > 0" class="flex flex-wrap gap-2">
        <Badge v-for="email in invites" :key="email" variant="secondary" class="gap-1 py-1 pr-1 pl-2.5">
          {{ email }}
          <button
            type="button"
            :aria-label="`Remove ${email}`"
            class="hover:bg-foreground/10 focus-visible:ring-ring min-h-6 rounded-full p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            @click="removeInvite(email)"
          >
            <X class="size-3" aria-hidden="true" />
          </button>
        </Badge>
      </div>
      <p v-else class="text-muted-foreground text-xs">No teammates invited yet.</p>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 text-xs underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
        @click="goNext"
      >
        Skip for now
      </button>
    </div>

    <!-- Step 3 · Preferences -->
    <div v-else-if="step === 3" class="divide-y rounded-lg border">
      <div v-for="pref in preferences" :key="pref.id" class="flex items-center justify-between gap-4 p-4">
        <div class="min-w-0">
          <p class="text-sm font-medium">{{ pref.label }}</p>
          <p class="text-muted-foreground mt-0.5 text-xs">{{ pref.description }}</p>
        </div>
        <Switch v-model="pref.enabled" :aria-label="pref.label" />
      </div>
    </div>

    <!-- Step 4 · Done -->
    <div v-else class="space-y-4 py-6 text-center">
      <div class="relative mx-auto size-16">
        <span class="bg-primary/20 absolute inset-0 rounded-full blur-2xl" aria-hidden="true"></span>
        <span
          class="border-success/30 bg-success/10 text-success relative flex size-16 items-center justify-center rounded-full border shadow-xs"
        >
          <Check class="size-8" aria-hidden="true" />
        </span>
      </div>
      <div>
        <p class="text-lg font-semibold">You're all set</p>
        <p class="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
          <template v-if="invites.length > 0">
            {{ workspaceName || 'Your workspace' }} is ready and {{ invites.length }} invitation{{
              invites.length === 1 ? '' : 's'
            }}
            sent.
          </template>
          <template v-else
            >{{ workspaceName || 'Your workspace' }} is ready — invite teammates anytime from settings.</template
          >
        </p>
      </div>
      <Button variant="outline" size="sm" @click="reset">Set up another workspace</Button>
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <Button v-if="step > 1 && step < 4" variant="ghost" size="sm" @click="step -= 1">
          <ChevronLeft aria-hidden="true" />
          Back
        </Button>
        <span v-else aria-hidden="true"></span>
        <span class="text-muted-foreground text-xs">Step {{ step }} of 4</span>
        <Button v-if="step < 4" size="sm" :disabled="step === 1 && workspaceName.trim() === ''" @click="goNext">
          {{ step === 3 ? 'Finish' : 'Continue' }}
          <ChevronRight aria-hidden="true" />
        </Button>
        <span v-else aria-hidden="true"></span>
      </div>
    </template>
  </SectionCard>
</template>
