<script lang="ts">
  import { DataList, DataListItem } from '@svelte-registry/data-list'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <DataList class="max-w-md">
    <DataListItem>
      <span class="text-muted-foreground text-sm">Invoice</span>
      <span class="text-sm font-medium">INV-2024-081</span>
    </DataListItem>
    <DataListItem>
      <span class="text-muted-foreground text-sm">Issued</span>
      <span class="text-sm font-medium">Mar 14, 2025</span>
    </DataListItem>
    <DataListItem>
      <span class="text-muted-foreground text-sm">Due</span>
      <span class="text-sm font-medium">Apr 14, 2025</span>
    </DataListItem>
    <DataListItem>
      <span class="text-muted-foreground text-sm">Amount</span>
      <span class="text-sm font-semibold tabular-nums">$4,280.00</span>
    </DataListItem>
  </DataList>
{/if}

{#if story === 'Multi-column grid'}
  <DataList class="max-w-lg">
    <DataListItem class="grid grid-cols-3 items-center justify-stretch gap-4">
      <span class="text-muted-foreground text-sm">Name</span>
      <span class="text-sm font-medium">Acme Corp</span>
      <span class="text-muted-foreground justify-self-end font-mono text-xs">ID-1024</span>
    </DataListItem>
    <DataListItem class="grid grid-cols-3 items-center justify-stretch gap-4">
      <span class="text-muted-foreground text-sm">Plan</span>
      <span class="text-sm font-medium">Enterprise</span>
      <span class="text-muted-foreground justify-self-end font-mono text-xs">$12k/yr</span>
    </DataListItem>
    <DataListItem class="grid grid-cols-3 items-center justify-stretch gap-4">
      <span class="text-muted-foreground text-sm">Owner</span>
      <span class="text-sm font-medium">Priya Nair</span>
      <span class="text-muted-foreground justify-self-end font-mono text-xs">CS-West</span>
    </DataListItem>
  </DataList>
{/if}

{#if story === 'With chips and badges'}
  <DataList class="max-w-md">
    <DataListItem>
      <span class="text-muted-foreground text-sm">Status</span>
      <span class="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">Active</span>
    </DataListItem>
    <DataListItem>
      <span class="text-muted-foreground text-sm">Role</span>
      <span class="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">Admin</span>
    </DataListItem>
    <DataListItem>
      <span class="text-muted-foreground text-sm">MFA</span>
      <span
        class="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
      >
        Enabled
      </span>
    </DataListItem>
  </DataList>
{/if}

{#if story === 'In a card with header'}
  <div class="max-w-md rounded-lg border">
    <div class="border-b px-5 py-4">
      <p class="text-sm font-semibold">Profile summary</p>
      <p class="text-muted-foreground text-xs">Read-only account metadata.</p>
    </div>
    <div class="px-5 py-2">
      <DataList>
        <DataListItem>
          <span class="text-muted-foreground text-sm">Email</span>
          <span class="text-sm font-medium">jordan@example.com</span>
        </DataListItem>
        <DataListItem>
          <span class="text-muted-foreground text-sm">Team</span>
          <span class="text-sm font-medium">Design Engineering</span>
        </DataListItem>
        <DataListItem>
          <span class="text-muted-foreground text-sm">Location</span>
          <span class="text-sm font-medium">Berlin, DE</span>
        </DataListItem>
      </DataList>
    </div>
  </div>
{/if}
