<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Toaster } from '@svelte-registry/sonner'
  import { toast } from 'svelte-sonner'

  let { story }: { story: string } = $props()

  function fakeAsync(ms = 1500, fail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => (fail ? reject(new Error('Network error')) : resolve('Saved')), ms)
    })
  }
</script>

{#if story === 'Variants'}
  <!-- One Toaster per page: it is mounted by the first story and serves every toast() call below. -->
  <Toaster position="bottom-right" />
  <div class="flex flex-wrap gap-2">
    <Button variant="outline" onclick={() => toast('Event has been created.')}>Default</Button>
    <Button variant="outline" onclick={() => toast.success('Saved successfully.')}>Success</Button>
    <Button variant="outline" onclick={() => toast.info('Heads up!')}>Info</Button>
    <Button variant="outline" onclick={() => toast.warning('Please review.')}>Warning</Button>
    <Button variant="outline" onclick={() => toast.error('Failed to save.')}>Error</Button>
    <Button
      variant="outline"
      onclick={() => toast('Settings updated', { description: 'Your preferences have been saved.' })}
    >
      With description
    </Button>
  </div>
{/if}

{#if story === 'With action button'}
  <div class="flex flex-wrap gap-2">
    <Button
      variant="outline"
      onclick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: { label: 'Undo', onClick: () => toast.success('Reverted') },
        })}
    >
      Show with action
    </Button>
    <Button
      variant="outline"
      onclick={() =>
        toast.success('Invitation sent', {
          action: { label: 'Resend', onClick: () => toast('Resending…') },
        })}
    >
      Success with action
    </Button>
  </div>
{/if}

{#if story === 'With dismiss button'}
  <div class="flex flex-wrap gap-2">
    <Button
      variant="outline"
      onclick={() => toast('Tap the X to dismiss this toast manually.', { closeButton: true })}
    >
      With close button
    </Button>
    <Button
      variant="outline"
      onclick={() =>
        toast.error('Something went wrong', {
          description: 'Click the X to clear this manually.',
          closeButton: true,
        })}
    >
      Error w/ close
    </Button>
  </div>
{/if}

{#if story === 'Long-running with manual dismiss'}
  <div class="flex flex-wrap gap-2">
    <Button
      variant="outline"
      onclick={() =>
        toast('Sticky notification', {
          description: 'This toast stays until you close it.',
          duration: Number.POSITIVE_INFINITY,
          closeButton: true,
        })}
    >
      Show sticky toast
    </Button>
  </div>
{/if}

{#if story === 'Promise toast'}
  <div class="flex flex-wrap gap-2">
    <Button
      variant="outline"
      onclick={() =>
        toast.promise(fakeAsync(1500), {
          loading: 'Saving…',
          success: 'Saved successfully.',
          error: 'Failed to save.',
        })}
    >
      Save (resolves)
    </Button>
    <Button
      variant="outline"
      onclick={() =>
        toast.promise(fakeAsync(1500, true), {
          loading: 'Saving…',
          success: 'Saved successfully.',
          error: 'Failed to save.',
        })}
    >
      Save (rejects)
    </Button>
  </div>
{/if}
