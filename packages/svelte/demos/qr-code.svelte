<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { QRCode, type QRCodeStatus } from '@svelte-registry/qr-code'

  let { story }: { story: string } = $props()

  let basicValue = $state('https://uipkge.dev')
  let customValue = $state('https://github.com/uday-a/sveltekit-boilerplate')
  let iconValue = $state('https://uipkge.dev')
  let longValue = $state('https://uipkge.dev/components/qr-code?demo=true&source=github&ref=main')

  const statuses: QRCodeStatus[] = ['active', 'expired', 'loading', 'scanned']
  let currentStatus = $state<QRCodeStatus>('active')
  let refreshCount = $state(0)

  const colors = [
    { color: '#000000', bgColor: '#ffffff', label: 'Default' },
    { color: '#1677ff', bgColor: '#ffffff', label: 'Blue' },
    { color: '#52c41a', bgColor: '#ffffff', label: 'Green' },
    { color: '#fa8c16', bgColor: '#ffffff', label: 'Orange' },
    { color: '#eb2f96', bgColor: '#ffffff', label: 'Pink' },
    { color: '#722ed1', bgColor: '#ffffff', label: 'Purple' },
  ]

  const errorLevels = ['L', 'M', 'Q', 'H'] as const
</script>

{#if story === 'Basic'}
  <QRCode value={basicValue} />
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-wrap items-end gap-4">
    <QRCode value={basicValue} size={80} />
    <QRCode value={basicValue} size={120} />
    <QRCode value={basicValue} size={160} />
    <QRCode value={basicValue} size={200} />
  </div>
{/if}

{#if story === 'Custom Colors'}
  <div class="flex flex-wrap gap-4">
    {#each colors as c (c.label)}
      <div class="flex flex-col items-center gap-1">
        <QRCode value={basicValue} color={c.color} bgColor={c.bgColor} size={100} />
        <span class="text-muted-foreground text-xs">{c.label}</span>
      </div>
    {/each}
  </div>
{/if}

{#if story === 'SVG Type'}
  <div class="flex gap-4">
    <QRCode value={basicValue} type="canvas" />
    <QRCode value={basicValue} type="svg" />
  </div>
{/if}

{#if story === 'With Icon'}
  <QRCode value={iconValue} icon="https://github.com/uday-a.png" iconSize={40} errorLevel="H" />
{/if}

{#if story === 'Error Levels'}
  <div class="flex flex-wrap gap-4">
    {#each errorLevels as level (level)}
      <div class="flex flex-col items-center gap-1">
        <QRCode value={longValue} errorLevel={level} size={120} />
        <span class="text-muted-foreground text-xs">Level {level}</span>
      </div>
    {/each}
  </div>
{/if}

{#if story === 'Borderless'}
  <QRCode value={basicValue} bordered={false} />
{/if}

{#if story === 'Margin / Quiet Zone'}
  <div class="flex gap-4">
    <QRCode value={basicValue} marginSize={0} size={120} />
    <QRCode value={basicValue} marginSize={2} size={120} />
    <QRCode value={basicValue} marginSize={4} size={120} />
  </div>
{/if}

{#if story === 'Status'}
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      {#each statuses as s (s)}
        <Button size="sm" variant={currentStatus === s ? 'default' : 'outline'} onclick={() => (currentStatus = s)}>
          {s}
        </Button>
      {/each}
    </div>
    <QRCode value={customValue} status={currentStatus} onrefresh={() => (refreshCount += 1)} />
    {#if refreshCount > 0}
      <p class="text-muted-foreground text-xs">Refresh triggered ×{refreshCount}</p>
    {/if}
  </div>
{/if}

{#if story === 'Long URL'}
  <div class="flex flex-col items-start gap-2">
    <QRCode value={longValue} size={200} errorLevel="H" />
    <p class="text-muted-foreground max-w-md truncate text-xs">{longValue}</p>
  </div>
{/if}

{#if story === 'Download'}
  <QRCode value={basicValue} />
{/if}

{#if story === 'Custom Content'}
  <QRCode value={basicValue}>
    {#snippet extra()}
      <div class="flex items-center gap-2">
        <Button size="sm" variant="outline" onclick={() => (basicValue = 'https://uipkge.dev/components/advance-select')}>
          Change URL
        </Button>
        <Button size="sm" variant="outline" onclick={() => (basicValue = 'https://uipkge.dev')}>Reset</Button>
      </div>
    {/snippet}
  </QRCode>
{/if}
