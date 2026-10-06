<script lang="ts">
  import { AdvanceSelect } from '@svelte-registry/advance-select'

  let { story }: { story: string } = $props()

  const basicOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian' },
    { value: 'elderberry', label: 'Elderberry' },
  ]

  const groupedOptions = [
    { value: 'beijing', label: 'Beijing', group: 'China' },
    { value: 'shanghai', label: 'Shanghai', group: 'China' },
    { value: 'tokyo', label: 'Tokyo', group: 'Japan' },
    { value: 'osaka', label: 'Osaka', group: 'Japan' },
    { value: 'seoul', label: 'Seoul', group: 'Korea' },
    { value: 'busan', label: 'Busan', group: 'Korea' },
  ]

  const disabledOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian', disabled: true },
    { value: 'elderberry', label: 'Elderberry' },
  ]

  let basic = $state<string>()
  let search = $state<string>()
  let multi = $state<string[]>([])
  let tags = $state<string[]>([])
  let grouped = $state<string>()
  let disabledValue = $state<string>()
  let loadingValue = $state<string>()
  let errorValue = $state<string>()
</script>

{#if story === 'Basic'}
  <div class="max-w-xs">
    <AdvanceSelect options={basicOptions} bind:value={basic} placeholder="Select a fruit..." />
  </div>
{/if}

{#if story === 'Searchable'}
  <div class="max-w-xs">
    <AdvanceSelect options={basicOptions} bind:value={search} showSearch placeholder="Search fruits..." />
  </div>
{/if}

{#if story === 'Multiple'}
  <div class="max-w-xs">
    <AdvanceSelect options={basicOptions} bind:value={multi} mode="multiple" placeholder="Pick fruits..." />
  </div>
{/if}

{#if story === 'Tags'}
  <div class="max-w-xs">
    <AdvanceSelect options={basicOptions} bind:value={tags} mode="tags" placeholder="Add tags..." />
  </div>
{/if}

{#if story === 'Grouped'}
  <div class="max-w-xs">
    <AdvanceSelect options={groupedOptions} bind:value={grouped} showSearch placeholder="Select a city..." />
  </div>
{/if}

{#if story === 'Disabled options'}
  <div class="max-w-xs">
    <AdvanceSelect options={disabledOptions} bind:value={disabledValue} placeholder="Select a fruit..." />
  </div>
{/if}

{#if story === 'Loading'}
  <div class="max-w-xs">
    <AdvanceSelect options={basicOptions} bind:value={loadingValue} loading placeholder="Loading..." />
  </div>
{/if}

{#if story === 'Status: error'}
  <div class="max-w-xs">
    <AdvanceSelect options={basicOptions} bind:value={errorValue} status="error" placeholder="Required field" />
  </div>
{/if}
