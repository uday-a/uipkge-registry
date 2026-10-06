<script lang="ts">
  import { Transfer, type TransferItem } from '@svelte-registry/transfer'

  let { story }: { story: string } = $props()

  const data: TransferItem[] = Array.from({ length: 15 }, (_, i) => ({
    key: `k-${i + 1}`,
    label: `Item ${i + 1}`,
    description: i % 3 === 0 ? `Group A` : `Group B`,
    disabled: i === 2,
  }))

  const big: TransferItem[] = Array.from({ length: 200 }, (_, i) => ({
    key: `big-${i}`,
    label: `Record ${i + 1}`,
  }))

  let target1 = $state<string[]>([])
  let target2 = $state<string[]>(['k-5', 'k-7'])
  let target3 = $state<string[]>([])
  let target4 = $state<string[]>([])
  let target5 = $state<string[]>([])
  let target6 = $state<string[]>(['k-1', 'k-4', 'k-6'])
  let target7 = $state<string[]>([])
</script>

{#if story === 'Basic'}
  <Transfer bind:targetKeys={target1} dataSource={data} />
{/if}

{#if story === 'With search'}
  <Transfer bind:targetKeys={target2} dataSource={data} showSearch />
{/if}

{#if story === 'With pagination'}
  <Transfer bind:targetKeys={target3} dataSource={big} pagination={{ pageSize: 8 }} showSearch />
{/if}

{#if story === 'One-way'}
  <Transfer bind:targetKeys={target4} dataSource={data} oneWay />
{/if}

{#if story === 'Drag and drop'}
  <Transfer bind:targetKeys={target6} dataSource={data} draggable showSearch />
{/if}

{#if story === 'selectable={false} (no checkboxes)'}
  <Transfer bind:targetKeys={target7} dataSource={data} selectable={false} draggable />
{/if}

{#if story === 'Custom titles + footer'}
  <Transfer bind:targetKeys={target5} dataSource={data} titles={['Available', 'Selected']}>
    {#snippet footerLeft()}
      <span class="text-xs text-muted-foreground">Tip: enable `draggable` for DnD.</span>
    {/snippet}
  </Transfer>
{/if}
