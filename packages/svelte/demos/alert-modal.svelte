<script lang="ts">
  import { AlertModal } from '@svelte-registry/alert-modal'
  import { Button } from '@svelte-registry/button'
  import { Trash } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let open1 = $state(false)
  let externalOpen = $state(false)
  let deleting = $state(false)
  let deleteOpen = $state(false)

  async function handleDelete() {
    deleting = true
    await new Promise((r) => setTimeout(r, 1200))
    deleting = false
    deleteOpen = false
  }
</script>

{#if story === 'Default'}
  <AlertModal
    title="Are you absolutely sure?"
    description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
    actionLabel="Continue"
  >
    {#snippet trigger()}
      <Button variant="outline">Show alert modal</Button>
    {/snippet}
  </AlertModal>
{/if}

{#if story === 'Destructive tone'}
  <AlertModal
    bind:open={open1}
    title="Delete project?"
    description="This permanently deletes the project and every file inside it. There is no recovery."
    tone="destructive"
    icon="error"
    actionLabel="Delete project"
    onAction={() => (open1 = false)}
  >
    {#snippet trigger()}
      <Button variant="destructive">
        <Trash class="size-4" />
        Delete project
      </Button>
    {/snippet}
  </AlertModal>
{/if}

{#if story === 'Tone variants'}
  <div class="flex flex-wrap gap-2">
    <AlertModal
      title="Heads up"
      description="Read this before proceeding."
      tone="default"
      icon="info"
      actionLabel="Got it"
      cancelLabel={null}
    >
      {#snippet trigger()}
        <Button variant="outline">Info</Button>
      {/snippet}
    </AlertModal>
    <AlertModal
      title="Saved"
      description="Your changes have been saved successfully."
      tone="success"
      icon="success"
      actionLabel="Done"
      cancelLabel={null}
    >
      {#snippet trigger()}
        <Button variant="outline">Success</Button>
      {/snippet}
    </AlertModal>
    <AlertModal
      title="Heads up"
      description="This will overwrite the existing config."
      tone="warning"
      icon="warning"
      actionLabel="Overwrite"
    >
      {#snippet trigger()}
        <Button variant="outline">Warning</Button>
      {/snippet}
    </AlertModal>
    <AlertModal
      title="Cannot continue"
      description="Your session has expired. Please sign in again."
      tone="destructive"
      icon="error"
      actionLabel="Sign in"
      cancelLabel={null}
    >
      {#snippet trigger()}
        <Button variant="outline">Error</Button>
      {/snippet}
    </AlertModal>
  </div>
{/if}

{#if story === 'Async action with loading'}
  <AlertModal
    bind:open={deleteOpen}
    title="Delete 24 files?"
    description="This permanently removes the selected items."
    tone="destructive"
    icon="error"
    actionLabel="Delete"
    loading={deleting}
    onAction={(e) => {
      e.preventDefault()
      void handleDelete()
    }}
  >
    {#snippet trigger()}
      <Button variant="destructive">Delete 24 files…</Button>
    {/snippet}
  </AlertModal>
{/if}

{#if story === 'Controlled (no trigger)'}
  <div class="flex flex-wrap items-center gap-2">
    <Button variant="outline" onclick={() => (externalOpen = true)}>Open from outside</Button>
    <AlertModal
      bind:open={externalOpen}
      title="Controlled dialog"
      description="No trigger — open state is driven entirely by the parent."
      actionLabel="Done"
    />
  </div>
{/if}
