<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { EmptyState } from '@svelte-registry/empty-state'
  import { FileX2, Inbox, Plus, Search, ServerCrash, Upload } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <EmptyState title="No messages" description="When you receive new messages, they'll appear here." icon={Inbox}>
    <Button class="mt-4">
      <Plus />
      New message
    </Button>
  </EmptyState>
{/if}

{#if story === 'Without action'}
  <EmptyState
    title="Nothing scheduled"
    description="You have no upcoming events on your calendar."
    icon={Inbox}
  />
{/if}

{#if story === 'With multiple actions'}
  <EmptyState
    title="Project is empty"
    description="Get started by creating a new file or importing existing data."
    icon={FileX2}
  >
    <div class="mt-4 flex flex-wrap justify-center gap-2">
      <Button>
        <Plus />
        New file
      </Button>
      <Button variant="outline">
        <Upload />
        Import
      </Button>
    </div>
  </EmptyState>
{/if}

{#if story === 'Different scenarios'}
  <div class="grid gap-6 md:grid-cols-3">
    <EmptyState
      class="rounded-lg border border-dashed py-8"
      title="No data yet"
      description="Records will show up here once created."
      icon={Inbox}
    />
    <EmptyState
      class="rounded-lg border border-dashed py-8"
      title="Something went wrong"
      description="We couldn't load this resource. Try again."
      icon={ServerCrash}
    >
      <Button variant="outline" size="sm" class="mt-4">Retry</Button>
    </EmptyState>
    <EmptyState
      class="rounded-lg border border-dashed py-8"
      title="No matches"
      description="No results match your current filters."
      icon={Search}
    >
      <Button variant="ghost" size="sm" class="mt-4">Clear filters</Button>
    </EmptyState>
  </div>
{/if}
