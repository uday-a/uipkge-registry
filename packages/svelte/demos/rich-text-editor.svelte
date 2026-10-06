<script lang="ts">
  import { RichTextEditor } from '@svelte-registry/rich-text-editor'

  let { story }: { story: string } = $props()

  let draft = $state('<h2>Launch notes</h2><p>Ship the <strong>hand-rolled</strong> Svelte port this week.</p><ul><li>Verify in the browser</li><li>Update the docs</li></ul>')
</script>

{#if story === 'Empty with placeholder'}
  <RichTextEditor />
{/if}

{#if story === 'Pre-filled content'}
  <RichTextEditor value="<h1>Welcome back</h1><p>Select some text and try the <strong>toolbar</strong> — headings, lists, alignment, and links are all here.</p><blockquote>Blockquotes render with a muted rail.</blockquote>" />
{/if}

{#if story === 'Custom min-height'}
  <RichTextEditor minHeight="220px" placeholder="A taller editing surface…" />
{/if}

{#if story === 'Side-by-side editing'}
  <div class="grid gap-4 md:grid-cols-2">
    <RichTextEditor bind:value={draft} />
    <div class="rounded-lg border p-3">
      <p class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">HTML output</p>
      <div class="prose prose-sm dark:prose-invert max-w-none text-sm">{@html draft}</div>
    </div>
  </div>
{/if}
