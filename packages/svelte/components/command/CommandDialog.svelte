<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface CommandDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    title?: string
    description?: string
    children?: Snippet
  }
</script>

<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '$lib/components/ui/dialog'
  import Command from './Command.svelte'

  let {
    open = $bindable(false),
    onOpenChange,
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
  }: CommandDialogProps = $props()
</script>

<Dialog bind:open {onOpenChange}>
  <DialogContent class="overflow-hidden p-0">
    <DialogHeader class="sr-only">
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <Command>
      {@render children?.()}
    </Command>
  </DialogContent>
</Dialog>
