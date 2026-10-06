<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@svelte-registry/card'
  import { CascadeSelect, type CascadeOption } from '@svelte-registry/cascade-select'

  let { story }: { story: string } = $props()

  let regionValue = $state<string[] | null>(null)
  let categoryValue = $state<string[] | null>(null)
  let preselectedValue = $state<string[] | null>(['zhejiang', 'hangzhou', 'xihu'])
  let smValue = $state<string[] | null>(null)
  let lgValue = $state<string[] | null>(null)
  let shippingValue = $state<string[] | null>(null)

  const regionData: CascadeOption[] = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            { value: 'xihu', label: 'West Lake' },
            { value: 'binjiang', label: 'Binjiang' },
          ],
        },
        {
          value: 'ningbo',
          label: 'Ningbo',
          children: [
            { value: 'haishu', label: 'Haishu' },
            { value: 'jiangbei', label: 'Jiangbei' },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            { value: 'xuanwu', label: 'Xuanwu' },
            { value: 'gulou', label: 'Gulou' },
          ],
        },
        {
          value: 'suzhou',
          label: 'Suzhou',
          children: [
            { value: 'gusu', label: 'Gusu' },
            { value: 'wuzhong', label: 'Wuzhong' },
          ],
        },
      ],
    },
    {
      value: 'guangdong',
      label: 'Guangdong',
      children: [
        {
          value: 'guangzhou',
          label: 'Guangzhou',
          children: [
            { value: 'tianhe', label: 'Tianhe' },
            { value: 'yuexiu', label: 'Yuexiu' },
          ],
        },
        {
          value: 'shenzhen',
          label: 'Shenzhen',
          children: [
            { value: 'nanshan', label: 'Nanshan' },
            { value: 'futian', label: 'Futian' },
          ],
        },
      ],
    },
  ]

  const categoryData: CascadeOption[] = [
    {
      value: 'electronics',
      label: 'Electronics',
      children: [
        {
          value: 'phones',
          label: 'Phones',
          children: [
            { value: 'iphone', label: 'iPhone' },
            { value: 'android', label: 'Android' },
          ],
        },
        {
          value: 'laptops',
          label: 'Laptops',
          children: [
            { value: 'macbook', label: 'MacBook' },
            { value: 'windows', label: 'Windows' },
          ],
        },
      ],
    },
    {
      value: 'clothing',
      label: 'Clothing',
      children: [
        {
          value: 'mens',
          label: "Men's",
          children: [
            { value: 'shirts', label: 'Shirts' },
            { value: 'pants', label: 'Pants' },
          ],
        },
        {
          value: 'womens',
          label: "Women's",
          children: [
            { value: 'dresses', label: 'Dresses' },
            { value: 'tops', label: 'Tops' },
          ],
        },
      ],
    },
  ]

  const restrictedData: CascadeOption[] = [
    {
      value: 'level1',
      label: 'Level 1',
      children: [
        { value: 'l1-a', label: 'Option A', disabled: true },
        { value: 'l1-b', label: 'Option B' },
      ],
    },
  ]
</script>

{#if story === 'Region picker'}
  <div class="max-w-md space-y-2">
    <CascadeSelect bind:value={regionValue} options={regionData} placeholder="Select a region..." class="w-full" />
    <p class="text-muted-foreground text-xs">Selected: {regionValue?.join(' / ') ?? 'none'}</p>
  </div>
{/if}

{#if story === 'Product category'}
  <div class="max-w-md space-y-2">
    <CascadeSelect bind:value={categoryValue} options={categoryData} placeholder="Select category..." class="w-full" />
    <p class="text-muted-foreground text-xs">Selected: {categoryValue?.join(' / ') ?? 'none'}</p>
  </div>
{/if}

{#if story === 'Size variants'}
  <div class="max-w-md space-y-3">
    <CascadeSelect bind:value={smValue} options={regionData} size="sm" placeholder="Small..." class="w-full" />
    <CascadeSelect options={regionData} placeholder="Default..." class="w-full" />
    <CascadeSelect bind:value={lgValue} options={regionData} size="lg" placeholder="Large..." class="w-full" />
  </div>
{/if}

{#if story === 'States & restrictions'}
  <div class="max-w-md space-y-3">
    <CascadeSelect options={regionData} loading placeholder="Loading..." class="w-full" />
    <CascadeSelect options={regionData} disabled placeholder="Disabled" class="w-full" />
    <CascadeSelect options={restrictedData} placeholder="Restricted options..." class="w-full" />
  </div>
{/if}

{#if story === 'Custom separator'}
  <div class="max-w-md space-y-2">
    <CascadeSelect
      bind:value={preselectedValue}
      options={regionData}
      clearable={false}
      separator=" > "
      placeholder="Select a region..."
      class="w-full"
    />
    <p class="text-muted-foreground text-xs">Path: {preselectedValue?.join(' > ') ?? 'none'}</p>
  </div>
{/if}

{#if story === 'In context: Shipping address'}
  <Card class="max-w-md">
    <CardHeader>
      <CardTitle>Shipping address</CardTitle>
      <CardDescription>Select your province, city, and district to calculate delivery.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <CascadeSelect
        bind:value={shippingValue}
        options={regionData}
        searchable
        searchPlaceholder="Search districts..."
        placeholder="Select delivery region..."
        class="w-full"
      />
      {#if shippingValue}
        <p class="text-muted-foreground text-xs">Delivering to: {shippingValue.join(' / ')}</p>
      {:else}
        <p class="text-muted-foreground text-xs">No region selected yet.</p>
      {/if}
    </CardContent>
  </Card>
{/if}
