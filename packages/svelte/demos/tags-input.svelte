<script lang="ts">
  import {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
  } from '@svelte-registry/tags-input'

  let { story }: { story: string } = $props()

  let tags = $state(['vue', 'nuxt', 'tailwind'])
  let pasteTags = $state<string[]>([])
  let csvTags = $state<string[]>(['design', 'systems'])
  let maxTags = $state<string[]>(['alpha', 'beta'])
  let lockedTags = $state(['read-only', 'locked'])
</script>

{#if story === 'Default'}
  <div class="max-w-md space-y-2">
    <span class="text-sm font-medium">Tags</span>
    <TagsInput bind:value={tags}>
      {#each tags as t (t)}
        <TagsInputItem value={t}>
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      {/each}
      <TagsInputInput placeholder="Add a tag..." />
    </TagsInput>
    <p class="text-muted-foreground text-xs">
      Value: <code class="text-foreground">{tags.join(', ') || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Add on paste'}
  <div class="max-w-md space-y-2">
    <span class="text-sm font-medium">Paste a list</span>
    <TagsInput bind:value={pasteTags} addOnPaste>
      {#each pasteTags as t (t)}
        <TagsInputItem value={t}>
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      {/each}
      <TagsInputInput placeholder="Try pasting: red green blue" />
    </TagsInput>
  </div>
{/if}

{#if story === 'Custom delimiter'}
  <div class="max-w-md space-y-2">
    <span class="text-sm font-medium">Comma-separated tags</span>
    <TagsInput bind:value={csvTags} delimiter=",">
      {#each csvTags as t (t)}
        <TagsInputItem value={t}>
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      {/each}
      <TagsInputInput placeholder="Type and press comma..." />
    </TagsInput>
  </div>
{/if}

{#if story === 'Max length'}
  <div class="max-w-md space-y-2">
    <span class="text-sm font-medium">Up to 3 tags</span>
    <TagsInput bind:value={maxTags} max={3}>
      {#each maxTags as t (t)}
        <TagsInputItem value={t}>
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      {/each}
      <TagsInputInput placeholder="Add another..." />
    </TagsInput>
    <p class="text-muted-foreground text-xs">{maxTags.length} / 3 tags</p>
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="max-w-md space-y-2">
    <span class="text-sm font-medium">Locked tags</span>
    <TagsInput bind:value={lockedTags} disabled>
      {#each lockedTags as t (t)}
        <TagsInputItem value={t}>
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      {/each}
      <TagsInputInput placeholder="Cannot edit" />
    </TagsInput>
  </div>
{/if}
