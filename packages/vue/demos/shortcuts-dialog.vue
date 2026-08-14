<script setup lang="ts">
import { ref } from 'vue'
import ShortcutsDialog from '@/components/blocks/shortcuts-dialog/ShortcutsDialog.vue'
import { Button } from '@/components/ui/button'

const forcedOpen = ref(false)

const longGroups = Array.from({ length: 5 }, (_, g) => ({
  label: `Group ${g + 1}`,
  shortcuts: Array.from({ length: 6 }, (_, s) => ({
    keys: ['⌘', '⇧', String(s + 1)],
    description: `Group ${g + 1} action ${s + 1}`,
  })),
}))
</script>

<template>
  <Story title="Default" description="Built-in trigger button with a Kbd hint; click to open the sheet.">
    <ShortcutsDialog />
  </Story>

  <Story title="Controlled open" description="Driven externally — the button below forces it open.">
    <div class="flex items-center gap-3">
      <Button size="sm" @click="forcedOpen = true">Open shortcuts</Button>
      <ShortcutsDialog :trigger="false" :open="forcedOpen" @update:open="forcedOpen = $event" />
    </div>
  </Story>

  <Story title="Custom groups" description="Swap in your own sections via the groups prop.">
    <ShortcutsDialog
      :groups="[
        {
          label: 'Board',
          shortcuts: [
            { keys: ['N'], description: 'New card' },
            { keys: ['⌘', '⏎'], description: 'Save card' },
            { keys: ['Space'], description: 'Pick up card' },
          ],
        },
        {
          label: 'View',
          shortcuts: [
            { keys: ['1', '2', '3'], description: 'Switch swimlanes' },
            { keys: ['F'], description: 'Toggle filters' },
          ],
        },
      ]"
    />
  </Story>

  <Story title="Single group" description="One focused section renders as a clean single column.">
    <ShortcutsDialog
      :groups="[
        {
          label: 'Editor',
          shortcuts: [
            { keys: ['⌘', 'B'], description: 'Bold selection' },
            { keys: ['⌘', 'I'], description: 'Italicize selection' },
            { keys: ['⌘', 'K'], description: 'Insert link' },
          ],
        },
      ]"
    />
  </Story>

  <Story title="Long list" description="Many shortcuts scroll inside the dialog while headers stay put.">
    <ShortcutsDialog :groups="longGroups" />
  </Story>

  <Story title="Custom trigger" description="trigger=false exposes the default slot for your own trigger.">
    <ShortcutsDialog :trigger="false">
      <button type="button" class="text-primary inline-flex min-h-6 items-center text-sm underline underline-offset-4">
        Keyboard shortcuts
      </button>
    </ShortcutsDialog>
  </Story>

  <Story title="No footer" description="footer=false drops the Esc hint row.">
    <ShortcutsDialog :footer="false" />
  </Story>

  <Story
    title="Windows modifiers"
    description="Keys are plain strings — render Ctrl-based combos for non-mac audiences."
  >
    <ShortcutsDialog
      :groups="[
        {
          label: 'Actions',
          shortcuts: [
            { keys: ['Ctrl', 'K'], description: 'Open command menu' },
            { keys: ['Ctrl', 'S'], description: 'Save changes' },
            { keys: ['Ctrl', '⇧', 'P'], description: 'Command palette' },
          ],
        },
      ]"
    />
  </Story>
</template>
