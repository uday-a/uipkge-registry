<script lang="ts">
  import { BlockUi } from '@svelte-registry/block-ui'
  import { Button } from '@svelte-registry/button'
  import { CloudUpload, Database, RefreshCw, ShieldCheck } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let saving = $state(false)
  let fetching = $state(false)
  let syncing = $state(false)

  async function saveSettings() {
    saving = true
    await new Promise((r) => setTimeout(r, 2200))
    saving = false
  }

  async function fetchReport() {
    fetching = true
    await new Promise((r) => setTimeout(r, 2500))
    fetching = false
  }

  async function syncData() {
    syncing = true
    await new Promise((r) => setTimeout(r, 3000))
    syncing = false
  }
</script>

{#if story === 'Settings form during save'}
  <div class="max-w-md">
    <BlockUi bind:value={saving} message="Saving your changes…">
      <div class="bg-card rounded-xl border shadow-sm">
        <div class="flex flex-col gap-1.5 p-6">
          <h3 class="text-base leading-none font-semibold tracking-tight">Project settings</h3>
          <p class="text-muted-foreground text-sm">Changes apply to all team members.</p>
        </div>
        <div class="space-y-4 p-6 pt-0">
          <div class="space-y-1.5">
            <label for="block-ui-name" class="text-sm leading-none font-medium">Project name</label>
            <input
              id="block-ui-name"
              value="Acme Website Redesign"
              class="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none"
            />
          </div>
          <div class="space-y-1.5">
            <label for="block-ui-owner" class="text-sm leading-none font-medium">Owner</label>
            <input
              id="block-ui-owner"
              value="sarah.johnson@acme.com"
              class="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none"
            />
          </div>
          <Button class="w-full" disabled={saving} onclick={saveSettings}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </BlockUi>
  </div>
{/if}

{#if story === 'Data fetch with blur'}
  <div class="flex max-w-md flex-col gap-3">
    <Button variant="outline" class="w-fit" disabled={fetching} onclick={fetchReport}>
      <RefreshCw class="mr-2 size-4 {fetching ? 'animate-spin' : ''}" />
      Refresh report
    </Button>
    <BlockUi bind:value={fetching} blur message="Loading report…">
      <div class="bg-card rounded-xl border shadow-sm">
        <div class="flex flex-col gap-1.5 p-6">
          <h3 class="text-base leading-none font-semibold tracking-tight">Q3 revenue summary</h3>
        </div>
        <div class="space-y-2 p-6 pt-0">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Total revenue</span>
            <span class="font-medium tabular-nums">$1,284,500</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">New customers</span>
            <span class="font-medium tabular-nums">342</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Churn rate</span>
            <span class="font-medium tabular-nums">2.1%</span>
          </div>
        </div>
      </div>
    </BlockUi>
  </div>
{/if}

{#if story === 'Custom overlay icon'}
  <div class="flex max-w-md flex-col gap-3">
    <Button variant="outline" class="w-fit" disabled={syncing} onclick={syncData}>
      <CloudUpload class="mr-2 size-4" />
      {syncing ? 'Syncing…' : 'Sync to cloud'}
    </Button>
    <BlockUi bind:value={syncing} showSpinner={false} message="Uploading 14 files…">
      {#snippet icon()}
        <CloudUpload class="text-primary size-8 animate-pulse" />
      {/snippet}
      <div class="bg-card rounded-xl border shadow-sm">
        <div class="p-5">
          <p class="text-sm font-medium">Cloud storage</p>
          <p class="text-muted-foreground mt-1 text-xs">3.2 GB of 10 GB used · 14 files pending</p>
        </div>
      </div>
    </BlockUi>
  </div>
{/if}

{#if story === 'Rich message slot'}
  <BlockUi value={true} showSpinner={false} class="max-w-md">
    {#snippet icon()}
      <ShieldCheck class="text-primary size-8" />
    {/snippet}
    {#snippet messageSnippet()}
      <div class="text-center">
        <p class="text-sm font-medium">Auditing schema</p>
        <p class="text-muted-foreground text-xs">This usually takes a few seconds</p>
      </div>
    {/snippet}
    <div class="bg-card rounded-xl border shadow-sm">
      <div class="p-6">
        <p class="text-sm font-medium">Compliance check</p>
        <p class="text-muted-foreground mt-1 text-xs">Running 42 rules against the current schema…</p>
      </div>
    </div>
  </BlockUi>
{/if}

{#if story === 'Overlay appearance'}
  <div class="grid max-w-md gap-4 sm:grid-cols-2">
    <BlockUi value={true} opacity={0.3} message="Light veil" showSpinner={false}>
      <div class="bg-card rounded-xl border shadow-sm">
        <div class="p-5">
          <p class="text-sm">30% opacity</p>
          <p class="text-muted-foreground text-xs">Subtle — content stays readable.</p>
        </div>
      </div>
    </BlockUi>
    <BlockUi value={true} overlayColor="#0a0a0a" opacity={0.7} message="Hard block" showSpinner={false}>
      <div class="bg-card rounded-xl border shadow-sm">
        <div class="p-5">
          <p class="text-sm">Dark overlay</p>
          <p class="text-muted-foreground text-xs">Opaque — focus is forced to the message.</p>
        </div>
      </div>
    </BlockUi>
  </div>
{/if}

{#if story === 'Database migration panel'}
  <BlockUi value={true} message="Running migration 0042…" class="max-w-md">
    <div class="bg-card rounded-xl border shadow-sm">
      <div class="flex flex-col gap-1.5 p-6">
        <h3 class="flex items-center gap-2 text-base leading-none font-semibold tracking-tight">
          <Database class="size-4" />
          Database migrations
        </h3>
        <p class="text-muted-foreground text-sm">Applied migrations are listed below.</p>
      </div>
      <div class="space-y-1.5 p-6 pt-0">
        <p class="text-muted-foreground text-xs">0039 · add_users_table · ✓</p>
        <p class="text-muted-foreground text-xs">0040 · add_audit_log · ✓</p>
        <p class="text-muted-foreground text-xs">0041 · index_trails · ✓</p>
        <p class="text-xs">0042 · split_orgs · running…</p>
      </div>
    </div>
  </BlockUi>
{/if}
