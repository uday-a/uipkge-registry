<script lang="ts">
  import { ColorPicker } from '@svelte-registry/color-picker'
  import { Button } from '@svelte-registry/button'

  let { story }: { story: string } = $props()

  let color = $state('#3b82f6')
  let accent = $state('#8b5cf6')
  let surface = $state('#f5f5f5')
  let teamColor = $state('#14b8a6')
</script>

{#if story === 'Default'}
  <div class="max-w-xs space-y-3">
    <ColorPicker bind:value={color} />
    <p class="text-muted-foreground text-sm">
      Selected: <span class="text-foreground font-mono font-medium">{color}</span>
    </p>
  </div>
{/if}

{#if story === 'Side by side'}
  <div class="flex max-w-md gap-6">
    <div class="flex-1 space-y-2">
      <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Accent</p>
      <ColorPicker bind:value={accent} hideHexInput />
    </div>
    <div class="flex-1 space-y-2">
      <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Surface</p>
      <ColorPicker bind:value={surface} hideHexInput />
    </div>
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="max-w-xs">
    <ColorPicker value="#22c55e" disabled />
  </div>
{/if}

{#if story === 'Custom presets'}
  <div class="max-w-xs space-y-3">
    <ColorPicker bind:value={teamColor} presets={['#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#111827']} />
    <p class="text-muted-foreground text-sm">
      Team color: <span class="text-foreground font-mono font-medium">{teamColor}</span>
    </p>
  </div>
{/if}

{#if story === 'In a form'}
  <form class="max-w-xs space-y-4" onsubmit={(e) => e.preventDefault()}>
    <div class="space-y-1.5">
      <label for="project-name" class="text-sm font-medium">Project name</label>
      <input
        id="project-name"
        type="text"
        value="Website refresh"
        class="bg-background border-input h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
    </div>
    <div class="space-y-1.5">
      <span id="project-color-label" class="text-sm font-medium">Project color</span>
      <ColorPicker bind:value={color} aria-labelledby="project-color-label" />
    </div>
    <Button type="submit" size="sm">Save project</Button>
  </form>
{/if}
