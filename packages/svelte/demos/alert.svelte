<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from '@svelte-registry/alert'
  import { Button } from '@svelte-registry/button'
  import { CircleAlert, CircleCheckBig, Info, RefreshCw, Terminal, TriangleAlert, X } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let dismissed = $state(false)
</script>

{#if story === 'Default'}
  <Alert>
    <Terminal class="size-4" />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
  </Alert>
{/if}

{#if story === 'Destructive'}
  <Alert variant="destructive">
    <CircleAlert class="size-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
  </Alert>
{/if}

{#if story === 'Tinted icons'}
  <div class="space-y-3">
    <Alert>
      <Info class="text-info size-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>Read this carefully — it explains a non-obvious behavior.</AlertDescription>
    </Alert>
    <Alert>
      <CircleCheckBig class="text-success size-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved.</AlertDescription>
    </Alert>
    <Alert>
      <TriangleAlert class="text-warning size-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>This action requires manual review.</AlertDescription>
    </Alert>
  </div>
{/if}

{#if story === 'With action button'}
  <Alert variant="destructive">
    <CircleAlert class="size-4" />
    <AlertTitle>Payment failed</AlertTitle>
    <AlertDescription class="flex items-center justify-between gap-3">
      <span>The card on file was declined. Try again or use a different method.</span>
      <Button size="sm" variant="outline" class="shrink-0 gap-1.5">
        <RefreshCw class="size-3.5" />
        Retry
      </Button>
    </AlertDescription>
  </Alert>
{/if}

{#if story === 'Dismissible'}
  <div class="space-y-2">
    {#if !dismissed}
      <Alert class="relative pr-12">
        <Info class="text-info size-4" />
        <AlertTitle>New release available</AlertTitle>
        <AlertDescription>v2.1.0 ships with the new theming engine. See the changelog.</AlertDescription>
        <Button
          variant="ghost"
          size="icon-sm"
          class="text-muted-foreground hover:text-foreground absolute top-2 right-2"
          aria-label="Dismiss"
          onclick={() => (dismissed = true)}
        >
          <X class="size-3.5" />
        </Button>
      </Alert>
    {/if}
    {#if dismissed}
      <Button size="sm" variant="outline" onclick={() => (dismissed = false)}>Restore alert</Button>
    {/if}
  </div>
{/if}
