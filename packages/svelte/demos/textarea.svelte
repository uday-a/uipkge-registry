<script lang="ts">
  import { Textarea } from '@svelte-registry/textarea'

  let { story }: { story: string } = $props()

  let bio = $state('Design engineer who cares about the last 4px.')
  let notes = $state('')
  let capped = $state('Hello')
</script>

{#if story === 'Default'}
  <Textarea label="Bio" placeholder="Tell us about yourself" hint="Shown on your public profile." class="max-w-md" />
{/if}

{#if story === 'Auto size'}
  <Textarea
    label="Notes"
    placeholder="Grows as you type…"
    autoSize
    bind:value={notes}
    hint="Type a few lines to watch it grow."
    class="max-w-md"
  />
{/if}

{#if story === 'Auto size with min & max rows'}
  <Textarea
    label="Feedback"
    placeholder="At least 2 rows, at most 5…"
    autoSize={{ minRows: 2, maxRows: 5 }}
    class="max-w-md"
  />
{/if}

{#if story === 'Show count'}
  <Textarea label="Bio" showCount bind:value={bio} hint="Character count in the corner." class="max-w-md" />
{/if}

{#if story === 'Max length with show count'}
  <Textarea
    label="Username"
    showCount
    maxLength={24}
    bind:value={capped}
    hint="Turns red past the limit."
    class="max-w-md"
  />
{/if}

{#if story === 'Allow clear'}
  <Textarea label="Search notes" allowClear placeholder="Type something, then clear it…" class="max-w-md" />
{/if}

{#if story === 'Disabled & Readonly'}
  <div class="flex max-w-md flex-col gap-4">
    <Textarea label="Disabled" value="Cannot edit this." disabled />
    <Textarea label="Readonly" value="Selectable but not editable." readonly />
  </div>
{/if}

{#if story === 'Variants'}
  <div class="flex max-w-md flex-col gap-4">
    <Textarea variant="outlined" label="Outlined" placeholder="Default variant" />
    <Textarea variant="filled" label="Filled" placeholder="Muted fill" />
    <Textarea variant="underlined" label="Underlined" placeholder="Bottom border only" />
  </div>
{/if}
