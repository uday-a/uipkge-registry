<script lang="ts">
  import { Checkbox, CheckboxGroup } from '@svelte-registry/checkbox'

  let { story }: { story: string } = $props()

  let checked = $state(true)

  // Group with options
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Pear', value: 'pear' },
    { label: 'Orange', value: 'orange', disabled: true },
  ]
  let selectedOptions = $state<string[]>(['apple'])

  // Check all / Uncheck all
  const fruits = ['Apple', 'Pear', 'Orange']
  const allFruits = fruits.map((f) => f.toLowerCase())
  let selectedFruits = $state<string[]>(['apple'])

  const allChecked = $derived(selectedFruits.length === fruits.length)
  const isIndeterminate = $derived(selectedFruits.length > 0 && selectedFruits.length < fruits.length)

  function toggleAll() {
    selectedFruits = allChecked ? [] : [...allFruits]
  }

  // Group disabled
  let disabledGroupValue = $state<string[]>(['b'])

  // Group inline
  let inlineValue = $state<string[]>(['a', 'c'])

  // Group with name
  let namedValue = $state<string[]>(['a'])

  const labelClass = 'cursor-pointer text-sm leading-none font-medium select-none'
</script>

{#if story === 'States'}
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <Checkbox id="c1" bind:checked />
      <label for="c1" class={labelClass}>Accept terms (live: <code>{checked}</code>)</label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="c2" checked={false} />
      <label for="c2" class={labelClass}>Unchecked</label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="c3" disabled />
      <label for="c3" class="{labelClass} text-muted-foreground">Disabled</label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="c4" checked disabled />
      <label for="c4" class="{labelClass} text-muted-foreground">Disabled checked</label>
    </div>
  </div>
{/if}

{#if story === 'In a list'}
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <Checkbox id="t1" checked />
      <label for="t1" class={labelClass}>Subscribe to newsletter</label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="t2" />
      <label for="t2" class={labelClass}>Allow analytics</label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="t3" />
      <label for="t3" class={labelClass}>Receive marketing emails</label>
    </div>
  </div>
{/if}

{#if story === 'Group with options'}
  <CheckboxGroup bind:value={selectedOptions} {options} label="Select fruits" />
{/if}

{#if story === 'Check all / Uncheck all'}
  <div class="space-y-2">
    <Checkbox checked={allChecked} indeterminate={isIndeterminate} label="Check all" onCheckedChange={toggleAll} />
    <div class="ml-6 space-y-2">
      <CheckboxGroup bind:value={selectedFruits}>
        {#each fruits as fruit (fruit)}
          <Checkbox value={fruit.toLowerCase()} label={fruit} />
        {/each}
      </CheckboxGroup>
    </div>
  </div>
{/if}

{#if story === 'Group disabled'}
  <CheckboxGroup
    bind:value={disabledGroupValue}
    disabled
    options={[
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
    ]}
    label="Disabled group"
  />
{/if}

{#if story === 'Group inline layout'}
  <CheckboxGroup
    bind:value={inlineValue}
    inline
    options={[
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
    ]}
  />
{/if}

{#if story === 'Group with name'}
  <CheckboxGroup
    bind:value={namedValue}
    name="my-checkbox-group"
    options={[
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ]}
    label="Named group"
  />
{/if}
