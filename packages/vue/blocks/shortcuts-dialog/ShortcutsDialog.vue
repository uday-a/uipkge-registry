<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Keyboard } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Kbd } from '@/components/ui/kbd'

interface Shortcut {
  keys: string[]
  description: string
}

interface ShortcutGroup {
  label: string
  shortcuts: Shortcut[]
}

const props = withDefaults(
  defineProps<{
    groups?: ShortcutGroup[]
    /** Render the built-in trigger button. */
    trigger?: boolean
    /** Show the 'Press Esc to close' footer hint. */
    footer?: boolean
    open?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    groups: () => [
      {
        label: 'Navigation',
        shortcuts: [
          { keys: ['G', 'I'], description: 'Go to inbox' },
          { keys: ['G', 'D'], description: 'Go to drafts' },
          { keys: ['⌘', 'K'], description: 'Open command menu' },
          { keys: ['⌥', '↑', '↓'], description: 'Move between items' },
        ],
      },
      {
        label: 'Actions',
        shortcuts: [
          { keys: ['C'], description: 'Compose new' },
          { keys: ['/'], description: 'Focus search' },
          { keys: ['⌘', 'S'], description: 'Save changes' },
          { keys: ['E'], description: 'Archive selection' },
        ],
      },
      {
        label: 'General',
        shortcuts: [
          { keys: ['?'], description: 'Show this dialog' },
          { keys: ['⇧', '?'], description: 'Show cheat sheet' },
          { keys: ['Esc'], description: 'Close dialogs' },
        ],
      },
    ],
    trigger: true,
    footer: true,
    open: undefined,
  },
)

const emit = defineEmits<{ 'update:open': [boolean] }>()

// Local state drives the uncontrolled case; the `open` prop takes precedence.
const internalOpen = ref(false)
const isOpen = computed({
  get: () => (props.open !== undefined ? props.open : internalOpen.value),
  set: (value) => {
    internalOpen.value = value
    emit('update:open', value)
  },
})
</script>

<template>
  <Dialog data-slot="shortcuts-dialog" v-model:open="isOpen">
    <DialogTrigger v-if="trigger" as-child>
      <Button variant="outline" size="sm">
        <Keyboard aria-hidden="true" />
        Shortcuts
        <Kbd>?</Kbd>
      </Button>
    </DialogTrigger>
    <slot v-else />
    <DialogContent :class="cn('max-w-lg', props.class)">
      <DialogHeader>
        <DialogTitle>Keyboard shortcuts</DialogTitle>
        <DialogDescription>Move faster without leaving the keyboard.</DialogDescription>
      </DialogHeader>
      <div class="grid max-h-[60vh] gap-x-8 gap-y-6 overflow-y-auto pr-1 sm:grid-cols-2">
        <div v-for="group in groups" :key="group.label" class="space-y-2">
          <p class="text-muted-foreground text-xs font-medium tracking-widest uppercase">{{ group.label }}</p>
          <ul class="divide-y">
            <li
              v-for="shortcut in group.shortcuts"
              :key="shortcut.description"
              class="flex items-center justify-between gap-4 py-1.5"
            >
              <span class="text-sm">{{ shortcut.description }}</span>
              <span class="flex shrink-0 items-center gap-1">
                <Kbd v-for="key in shortcut.keys" :key="key">{{ key }}</Kbd>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <DialogFooter v-if="footer" class="justify-start">
        <p class="text-muted-foreground flex items-center gap-1.5 text-xs">Press <Kbd>Esc</Kbd> to close</p>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
