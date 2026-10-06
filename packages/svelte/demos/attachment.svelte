<script lang="ts">
  import { Attachment } from '@svelte-registry/attachment'

  let { story }: { story: string } = $props()

  let removed = $state(false)
</script>

{#if story === 'Default'}
  <Attachment title="sales-dashboard.pdf" description="PDF · 2.4 MB" />
{/if}

{#if story === 'State'}
  <div class="flex flex-col gap-3">
    <Attachment title="Add a file" description="PNG or JPG" state="idle" media="image" />
    <Attachment title="sales-dashboard.pdf" description="Uploading · 64%" state="uploading" />
    <Attachment title="invoice.png" description="Processing" state="processing" media="image" />
    <Attachment title="corrupt.bin" description="Upload failed" state="error" removable />
    <Attachment title="notes.pdf" description="PDF · 2.4 MB" state="done" />
  </div>
{/if}

{#if story === 'Size'}
  <div class="flex flex-col gap-3">
    <Attachment title="schema.ts" description="TypeScript · default" media="code" size="default" />
    <Attachment title="schema.ts" description="TypeScript · sm" media="code" size="sm" />
    <Attachment title="schema.ts" description="TypeScript · xs" media="code" size="xs" />
  </div>
{/if}

{#if story === 'Orientation'}
  <Attachment title="cover.jpg" description="JPG · 1.1 MB" media="image" orientation="vertical" />
{/if}

{#if story === 'Media'}
  <div class="flex flex-col gap-3">
    <Attachment title="brief.pdf" description="PDF · 820 KB" media="file" />
    <Attachment title="schema.ts" description="TS · 12 KB" media="code" />
    <Attachment
      title="hero.webp"
      description="WEBP · 940 KB"
      media="image"
      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop&q=80"
      alt="Coast"
    />
  </div>
{/if}

{#if story === 'Removable'}
  {#if !removed}
    <Attachment title="notes.pdf" description="PDF · 2.4 MB" removable onRemove={() => (removed = true)} />
  {:else}
    <p class="text-muted-foreground text-sm">Attachment removed.</p>
  {/if}
{/if}

{#if story === 'Title only'}
  <Attachment title="untitled.bin" />
{/if}

{#if story === 'Long title'}
  <Attachment
    class="max-w-xs"
    title="very-long-quarterly-sales-dashboard-export-final-v3.pdf"
    description="PDF · 18.2 MB"
  />
{/if}
