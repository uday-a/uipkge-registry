<script lang="ts">
  import { SpeedDial, type SpeedDialAction } from '@svelte-registry/speed-dial'
  import {
    Camera,
    FileText,
    Image,
    Mail,
    MapPin,
    MessageSquare,
    Mic,
    Notebook,
    Paperclip,
    Plus,
    Send,
    Share2,
    Video,
  } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let log = $state<string[]>([])

  function push(label: string) {
    log = [`${label} triggered`, ...log].slice(0, 4)
  }

  const composeActions: SpeedDialAction[] = [
    { icon: FileText, label: 'New document', handler: () => push('New document') },
    { icon: Image, label: 'New image', handler: () => push('New image') },
    { icon: Notebook, label: 'New notebook', handler: () => push('New notebook') },
  ]

  const shareActions: SpeedDialAction[] = [
    { icon: Mail, label: 'Email', handler: () => push('Email') },
    { icon: MessageSquare, label: 'Message', handler: () => push('Message') },
    { icon: Share2, label: 'Copy link', handler: () => push('Copy link') },
  ]

  const mediaActions: SpeedDialAction[] = [
    { icon: Camera, label: 'Camera', handler: () => push('Camera') },
    { icon: Video, label: 'Video', handler: () => push('Video') },
    { icon: Mic, label: 'Audio', handler: () => push('Audio') },
    { icon: MapPin, label: 'Location', handler: () => push('Location') },
  ]

  const attachActions: SpeedDialAction[] = [
    { icon: Paperclip, label: 'Attach file', handler: () => push('Attach file') },
    { icon: Send, label: 'Send now', handler: () => push('Send now'), disabled: true },
  ]
</script>

{#if story === 'Compose menu (click)'}
  <div class="flex h-56 items-end gap-8">
    <SpeedDial actions={composeActions} position="inline" label="Create" />
    <div class="text-muted-foreground text-xs">
      <p class="mb-1 font-medium">Recent:</p>
      {#each log as entry (entry)}
        <p>{entry}</p>
      {/each}
      {#if !log.length}
        <p>No actions yet.</p>
      {/if}
    </div>
  </div>
{/if}

{#if story === 'Share menu (hover)'}
  <div class="flex h-56 items-end">
    <SpeedDial actions={shareActions} trigger="hover" position="inline" label="Share" />
  </div>
{/if}

{#if story === 'In a card'}
  <div class="bg-card relative max-w-md overflow-hidden rounded-lg border">
    <div class="p-6 pb-2">
      <h3 class="font-semibold">New capture</h3>
      <p class="text-muted-foreground text-sm">Choose how you'd like to start recording.</p>
    </div>
    <div class="p-6 pt-2">
      <div class="bg-muted/30 text-muted-foreground flex h-32 items-center justify-center rounded-md text-sm">
        Preview area
      </div>
    </div>
    <SpeedDial actions={mediaActions} absolute position="bottom-right" label="Capture" />
  </div>
{/if}

{#if story === 'Directions'}
  <div class="flex h-64 items-center justify-around gap-8">
    <SpeedDial actions={mediaActions} direction="up" position="inline" label="Up" />
    <SpeedDial actions={mediaActions} direction="down" position="inline" label="Down" />
    <SpeedDial actions={mediaActions} direction="left" position="inline" label="Left" />
    <SpeedDial actions={mediaActions} direction="right" position="inline" label="Right" />
  </div>
{/if}

{#if story === 'Variants & custom icon'}
  <div class="flex h-56 items-end gap-6">
    <SpeedDial actions={composeActions} variant="default" position="inline" label="Default" />
    <SpeedDial actions={composeActions} variant="secondary" position="inline" label="Secondary" />
    <SpeedDial actions={composeActions} variant="outline" icon={Plus} position="inline" label="Outline" />
  </div>
{/if}

{#if story === 'Disabled action & keep-open'}
  <div class="flex h-56 items-end gap-8">
    <SpeedDial actions={attachActions} position="inline" label="Attach" />
    <SpeedDial actions={composeActions} closeOnAction={false} position="inline" label="Keep open" />
  </div>
{/if}

{#if story === 'Fixed to viewport'}
  <p class="text-muted-foreground max-w-md text-sm">
    The dial in the corner is live and stays anchored as you scroll.
  </p>
  <SpeedDial actions={composeActions} label="Create" />
{/if}
