<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component, HTMLAttributes } from 'vue'
import { Bell, Building2, CreditCard, Palette, TriangleAlert, User } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionCard } from '@/components/ui/section-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type SectionId = 'profile' | 'notifications' | 'appearance' | 'workspace' | 'billing' | 'danger'

interface SettingsSection {
  id: SectionId
  label: string
  icon: Component
}

const props = withDefaults(
  defineProps<{
    /** Override the nav. Ids must still match the built-in panels. */
    sections?: SettingsSection[]
    /** Initially active section id. */
    initialSection?: SectionId
    class?: HTMLAttributes['class']
  }>(),
  {
    sections: undefined,
    initialSection: 'profile',
  },
)

const defaultSections: SettingsSection[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'danger', label: 'Danger zone', icon: TriangleAlert },
]

const sections = computed(() => props.sections ?? defaultSections)
const active = ref<SectionId>(props.initialSection)

const notifyEmail = ref(true)
const notifyPush = ref(false)
const notifyDigest = ref(true)
const themeChoice = ref<'light' | 'dark' | 'system'>('system')
const deleteOpen = ref(false)
const deleteConfirm = ref('')

function switchPanel(id: SectionId) {
  active.value = id
}
</script>

<template>
  <div
    data-slot="settings-page"
    :class="cn('bg-background border-border flex min-h-svh flex-col rounded-xl border lg:flex-row', props.class)"
  >
    <!-- Nav rail -->
    <nav class="border-border shrink-0 border-b p-3 lg:w-56 lg:border-r lg:border-b-0" aria-label="Settings sections">
      <div
        class="flex [scrollbar-width:none] gap-1 overflow-x-auto lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="focus-visible:ring-ring flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :class="
            active === section.id
              ? section.id === 'danger'
                ? 'text-destructive bg-destructive/10'
                : 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          "
          :aria-current="active === section.id ? 'page' : undefined"
          @click="switchPanel(section.id)"
        >
          <component :is="section.icon" class="size-4" aria-hidden="true" />
          {{ section.label }}
        </button>
      </div>
    </nav>

    <!-- Content pane -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Profile -->
      <section v-if="active === 'profile'" class="flex flex-1 flex-col">
        <div class="flex-1 space-y-6 p-6">
          <SectionCard title="Public profile" description="How teammates see you across the workspace.">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="sp-name">Display name</Label>
                <Input id="sp-name" model-value="Amara Osei" />
              </div>
              <div class="space-y-2">
                <Label for="sp-email">Email</Label>
                <Input id="sp-email" model-value="amara@acme.com" type="email" />
              </div>
              <div class="space-y-2">
                <Label for="sp-bio">Bio</Label>
                <Textarea id="sp-bio" model-value="Design engineer. Builds systems, breaks assumptions." :rows="3" />
              </div>
              <div class="space-y-2">
                <Label for="sp-role">Role</Label>
                <Select model-value="editor">
                  <SelectTrigger id="sp-role" class="w-full sm:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>
        </div>
        <div class="border-border flex items-center justify-end gap-2 border-t p-4">
          <Button variant="ghost" size="sm">Discard</Button>
          <Button size="sm">Save changes</Button>
        </div>
      </section>

      <!-- Notifications -->
      <section v-else-if="active === 'notifications'" class="flex-1 p-6">
        <SectionCard title="Notifications" description="Choose what reaches you and where.">
          <ul class="-my-4 divide-y">
            <li class="flex items-center justify-between gap-4 py-4">
              <div>
                <p class="text-sm font-medium">Email notifications</p>
                <p class="text-muted-foreground text-xs">Mentions, assignments and approvals.</p>
              </div>
              <Switch v-model="notifyEmail" aria-label="Toggle email notifications" />
            </li>
            <li class="flex items-center justify-between gap-4 py-4">
              <div>
                <p class="text-sm font-medium">Push notifications</p>
                <p class="text-muted-foreground text-xs">Real-time browser alerts while you work.</p>
              </div>
              <Switch v-model="notifyPush" aria-label="Toggle push notifications" />
            </li>
            <li class="flex items-center justify-between gap-4 py-4">
              <div>
                <p class="text-sm font-medium">Weekly digest</p>
                <p class="text-muted-foreground text-xs">A summary of everything, every Monday.</p>
              </div>
              <Switch v-model="notifyDigest" aria-label="Toggle weekly digest" />
            </li>
          </ul>
        </SectionCard>
      </section>

      <!-- Appearance -->
      <section v-else-if="active === 'appearance'" class="flex-1 p-6">
        <SectionCard title="Appearance" description="Theme follows your system by default.">
          <div class="space-y-5">
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="theme in ['light', 'dark', 'system'] as const"
                :key="theme"
                type="button"
                class="focus-visible:ring-ring rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                :class="themeChoice === theme ? 'border-primary ring-primary/20 ring-2' : 'hover:bg-accent/50'"
                @click="themeChoice = theme"
              >
                <span class="block text-sm font-medium capitalize">{{ theme }}</span>
                <span class="text-muted-foreground block text-xs">
                  {{ theme === 'light' ? 'Bright surfaces' : theme === 'dark' ? 'Low-light friendly' : 'Match device' }}
                </span>
              </button>
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">Reduced motion</p>
                <p class="text-muted-foreground text-xs">Collapse animations to instant transitions.</p>
              </div>
              <Switch :model-value="false" aria-label="Toggle reduced motion" />
            </div>
          </div>
        </SectionCard>
      </section>

      <!-- Workspace -->
      <section v-else-if="active === 'workspace'" class="flex-1 p-6">
        <SectionCard title="Workspace" description="Identity and defaults for everyone here.">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="sp-ws-name">Workspace name</Label>
              <Input id="sp-ws-name" model-value="Acme Inc" />
            </div>
            <div class="space-y-2">
              <Label for="sp-ws-url">URL slug</Label>
              <div class="flex">
                <span
                  class="border-border bg-muted text-muted-foreground flex items-center rounded-l-md border px-3 font-mono text-xs"
                >
                  acme.uipkge.app
                </span>
                <Input id="sp-ws-url" model-value="acme" class="rounded-l-none font-mono text-xs" />
              </div>
            </div>
            <p class="text-muted-foreground text-xs">16 members · 4 pending invites</p>
          </div>
        </SectionCard>
      </section>

      <!-- Billing -->
      <section v-else-if="active === 'billing'" class="flex-1 p-6">
        <SectionCard title="Billing" description="Plan, seats and invoices.">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">Team plan · $12 / seat / month</p>
              <p class="text-muted-foreground mt-1 text-xs">Next invoice Sep 1, 2026 · 18 seats</p>
            </div>
            <Button variant="outline" size="sm">Manage billing</Button>
          </div>
        </SectionCard>
      </section>

      <!-- Danger zone -->
      <section v-else class="flex-1 p-6">
        <div class="border-destructive/40 rounded-xl border p-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-destructive text-sm font-medium">Delete this workspace</p>
              <p class="text-muted-foreground mt-1 text-xs">
                All projects, members and data will be permanently removed.
              </p>
            </div>
            <Button variant="destructive" size="sm" @click="deleteOpen = true">Delete…</Button>
          </div>
        </div>
      </section>
    </div>

    <Dialog v-model:open="deleteOpen">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete workspace?</DialogTitle>
          <DialogDescription>
            This removes Acme Inc and all of its data for every member. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Input v-model="deleteConfirm" placeholder='Type "DELETE" to confirm' />
        <DialogFooter>
          <Button variant="outline" size="sm" @click="deleteOpen = false">Cancel</Button>
          <Button variant="destructive" size="sm" :disabled="deleteConfirm !== 'DELETE'" @click="deleteOpen = false">
            Delete forever
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
