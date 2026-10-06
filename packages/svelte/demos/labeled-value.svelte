<script lang="ts">
  import { LabeledValue } from '@svelte-registry/labeled-value'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default grid'}
  <div class="grid grid-cols-2 gap-x-8 gap-y-3">
    <LabeledValue label="Email" value="jane@example.com" />
    <LabeledValue label="Role" value="Admin" />
    <LabeledValue label="Status" value="Active" />
    <LabeledValue label="Plan" value="Enterprise" />
  </div>
{/if}

{#if story === 'Vertical stack'}
  <div class="flex max-w-sm flex-col gap-3">
    <LabeledValue label="Order" value="#ORD-9041" />
    <LabeledValue label="Customer" value="Acme Corp" />
    <LabeledValue label="Total" value="$1,240.00" />
  </div>
{/if}

{#if story === 'Custom value via children'}
  <div class="flex max-w-sm flex-col gap-3">
    <LabeledValue label="Status">
      <span class="inline-flex items-center gap-1.5 text-sm font-medium">
        <span class="size-2 rounded-full bg-emerald-500"></span>
        Active
      </span>
    </LabeledValue>
    <LabeledValue label="Progress">
      <span class="text-sm font-medium tabular-nums">72%</span>
    </LabeledValue>
  </div>
{/if}

{#if story === 'Truncated long values'}
  <div class="flex max-w-xs flex-col gap-3">
    <LabeledValue label="API key" value="sk-live-9f2c7ab41de84c0aa13f5e77b201" />
    <LabeledValue label="Webhook" value="https://example.com/api/v1/hooks/incoming/orders" />
  </div>
{/if}
