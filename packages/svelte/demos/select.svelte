<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    NativeSelect,
  } from '@svelte-registry/select'

  let { story }: { story: string } = $props()

  let fruit = $state<string | undefined>('apple')
  let timezone = $state<string | undefined>(undefined)
</script>

{#if story === 'Default'}
  <div class="flex flex-col gap-2">
    <Select bind:value={fruit}>
      <SelectTrigger class="w-56">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="date">Date</SelectItem>
      </SelectContent>
    </Select>
    <p class="text-muted-foreground text-xs">Selected: {fruit ?? 'none'}</p>
  </div>
{/if}

{#if story === 'Grouped with labels'}
  <Select bind:value={timezone}>
    <SelectTrigger class="w-64">
      <SelectValue placeholder="Pick a timezone" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Americas</SelectLabel>
        <SelectItem value="ny">New York (ET)</SelectItem>
        <SelectItem value="chi">Chicago (CT)</SelectItem>
        <SelectItem value="sf">San Francisco (PT)</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Europe</SelectLabel>
        <SelectItem value="lon">London (GMT)</SelectItem>
        <SelectItem value="ber">Berlin (CET)</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
{/if}

{#if story === 'Disabled item'}
  <Select defaultValue="apple">
    <SelectTrigger class="w-56">
      <SelectValue placeholder="Pick a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana" disabled>Banana (out of stock)</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
    </SelectContent>
  </Select>
{/if}

{#if story === 'Sizes and states'}
  <div class="flex w-56 flex-col gap-3">
    <Select>
      <SelectTrigger size="sm">
        <SelectValue placeholder="Small" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
    <Select>
      <SelectTrigger state="error" aria-invalid="true">
        <SelectValue placeholder="Error state" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
    <Select>
      <SelectTrigger loading>
        <SelectValue placeholder="Loading…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
  </div>
{/if}

{#if story === 'Disabled trigger'}
  <Select disabled>
    <SelectTrigger class="w-56">
      <SelectValue placeholder="Unavailable" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="a">Option A</SelectItem>
    </SelectContent>
  </Select>
{/if}

{#if story === 'Native select'}
  <div class="flex w-56 flex-col gap-3">
    <NativeSelect
      options={['Apple', 'Banana', 'Cherry']}
      defaultValue="Banana"
      aria-label="Pick a fruit"
    />
    <NativeSelect
      size="sm"
      options={[
        { label: 'New York (ET)', value: 'ny' },
        { label: 'Chicago (CT)', value: 'chi', disabled: true },
        { label: 'London (GMT)', value: 'lon' },
      ]}
      defaultValue="lon"
      aria-label="Pick a timezone"
    />
  </div>
{/if}
