<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Page, PageBody, PageHeader, PageHeaderHeading } from '@svelte-registry/page'
  import { ChevronRight, Download, Filter, Plus } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const kpis = [
    { label: 'Revenue', value: '$48.2k' },
    { label: 'Active users', value: '12,310' },
    { label: 'Conversion', value: '3.4%' },
  ]
</script>

{#if story === 'Default'}
  {#snippet defaultActions()}
    <div class="flex gap-2">
      <Button variant="outline" size="sm">Cancel</Button>
      <Button size="sm">Save</Button>
    </div>
  {/snippet}
  <Page>
    <PageHeader actions={defaultActions}>
      <PageHeaderHeading
        title="Page header"
        description="Page is the root layout for app screens. PageHeader stacks title + actions."
      />
    </PageHeader>

    <PageBody>
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="p-6 py-8 text-center text-sm text-muted-foreground">
          Page body content goes here. Use SectionCard, blocks, or your own grid layout below the header.
        </div>
      </div>
    </PageBody>
  </Page>
{/if}

{#if story === 'Multiple actions'}
  {#snippet reportActions()}
    <div class="flex gap-2">
      <Button variant="outline" size="sm"><Filter class="size-4" aria-hidden="true" /> Filter</Button>
      <Button variant="outline" size="sm"><Download class="size-4" aria-hidden="true" /> Export</Button>
      <Button size="sm"><Plus class="size-4" aria-hidden="true" /> New report</Button>
    </div>
  {/snippet}
  <Page>
    <PageHeader actions={reportActions}>
      <PageHeaderHeading title="Reports" description="Sales performance across all channels." />
    </PageHeader>

    <PageBody>
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="p-6 py-8 text-center text-sm text-muted-foreground">Reports table goes here.</div>
      </div>
    </PageBody>
  </Page>
{/if}

{#if story === 'Body with grid'}
  <Page>
    <PageHeader>
      <PageHeaderHeading title="Dashboard" description="Key metrics and recent activity." />
    </PageHeader>

    <PageBody>
      <div class="grid gap-4 sm:grid-cols-3">
        {#each kpis as kpi}
          <div class="rounded-xl border bg-card text-card-foreground shadow">
            <div class="flex flex-col gap-1.5 p-6 pb-2">
              <p class="text-sm text-muted-foreground">{kpi.label}</p>
              <p class="text-2xl font-semibold">{kpi.value}</p>
            </div>
            <div class="p-6 pt-0">
              <p class="text-xs text-muted-foreground">vs. previous period</p>
            </div>
          </div>
        {/each}
      </div>
    </PageBody>
  </Page>
{/if}

{#if story === 'Title only'}
  {#snippet settingsActions()}
    <div class="flex gap-2">
      <Button size="sm">Save changes</Button>
    </div>
  {/snippet}
  <Page>
    <PageHeader actions={settingsActions}>
      <PageHeaderHeading title="Settings" />
    </PageHeader>

    <PageBody>
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="p-6 py-8 text-center text-sm text-muted-foreground">Settings form goes here.</div>
      </div>
    </PageBody>
  </Page>
{/if}

{#if story === 'With breadcrumb'}
  {#snippet projectActions()}
    <div class="flex gap-2">
      <Button variant="outline" size="sm">Archive</Button>
      <Button size="sm">Edit</Button>
    </div>
  {/snippet}
  <Page>
    <PageHeader actions={projectActions}>
      <div class="space-y-2">
        <nav aria-label="Breadcrumb">
          <ol class="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><a href="#page" class="transition-colors hover:text-foreground">Workspace</a></li>
            <li aria-hidden="true"><ChevronRight class="size-3.5" /></li>
            <li><a href="#page" class="transition-colors hover:text-foreground">Projects</a></li>
            <li aria-hidden="true"><ChevronRight class="size-3.5" /></li>
            <li aria-current="page" class="font-normal text-foreground">Acme website</li>
          </ol>
        </nav>
        <PageHeaderHeading title="Acme website" description="Customer-facing marketing site." />
      </div>
    </PageHeader>

    <PageBody>
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="p-6 py-8 text-center text-sm text-muted-foreground">Project details go here.</div>
      </div>
    </PageBody>
  </Page>
{/if}
