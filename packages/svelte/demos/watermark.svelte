<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Watermark } from '@svelte-registry/watermark'

  let { story }: { story: string } = $props()

  const reportText =
    'Q3 revenue grew 18% YoY, driven by enterprise expansion and a 32% increase in self-serve signups. Net retention reached 118%, with three of the top five accounts expanding their seat count beyond the 500-user threshold.'
</script>

{#if story === 'Confidential document'}
  <Watermark content="CONFIDENTIAL" opacity={0.12} class="rounded-lg border p-6">
    <p class="text-sm leading-relaxed">{reportText}</p>
  </Watermark>
{/if}

{#if story === 'Draft card'}
  <Watermark content="DRAFT" rotate={-30} opacity={0.15} fontSize={20} fontWeight={700}>
    <div class="bg-card max-w-md rounded-lg border">
      <div class="space-y-1.5 p-6 pb-0">
        <h3 class="text-lg font-semibold">Onboarding flow v2</h3>
        <p class="text-muted-foreground text-sm">Subject to review — do not share externally.</p>
      </div>
      <div class="space-y-2 p-6 text-sm">
        <p>1. Welcome screen with product tour</p>
        <p>2. Workspace setup (3 steps)</p>
        <p>3. Invite teammates</p>
      </div>
    </div>
  </Watermark>
{/if}

{#if story === 'Internal report'}
  <Watermark content="INTERNAL" opacity={0.08} rotate={-22} gap={140}>
    <div class="bg-card max-w-md rounded-lg border">
      <div class="space-y-1.5 p-6 pb-0">
        <h3 class="text-lg font-semibold">Quarterly Report</h3>
        <p class="text-muted-foreground text-sm">FY2024 Q3 — Leadership review</p>
      </div>
      <div class="space-y-2 p-6 text-sm">
        <div class="flex justify-between"><span>Revenue</span><span class="tabular-nums">$1,240,000</span></div>
        <div class="flex justify-between"><span>Expenses</span><span class="tabular-nums">$890,000</span></div>
        <div class="flex justify-between font-medium">
          <span>Net profit</span><span class="tabular-nums">$350,000</span>
        </div>
      </div>
    </div>
  </Watermark>
{/if}

{#if story === 'Angle & density variants'}
  <div class="grid max-w-2xl gap-4 sm:grid-cols-3">
    <Watermark content="UIPKGE" rotate={0} gap={80} class="rounded-lg border p-4">
      <p class="text-muted-foreground text-xs">0° · gap 80</p>
    </Watermark>
    <Watermark content="UIPKGE" rotate={-22} gap={100} class="rounded-lg border p-4">
      <p class="text-muted-foreground text-xs">-22° · gap 100</p>
    </Watermark>
    <Watermark content="UIPKGE" rotate={-45} gap={120} class="rounded-lg border p-4">
      <p class="text-muted-foreground text-xs">-45° · gap 120</p>
    </Watermark>
  </div>
{/if}

{#if story === 'Opacity & color'}
  <div class="grid max-w-2xl gap-4 sm:grid-cols-3">
    <Watermark content="SAMPLE" opacity={0.04} class="rounded-lg border p-4">
      <p class="text-muted-foreground text-xs">opacity 0.04</p>
    </Watermark>
    <Watermark content="SAMPLE" opacity={0.12} class="rounded-lg border p-4">
      <p class="text-muted-foreground text-xs">opacity 0.12</p>
    </Watermark>
    <Watermark content="SAMPLE" opacity={0.2} color="#3b82f6" class="rounded-lg border p-4">
      <p class="text-muted-foreground text-xs">blue · 0.2</p>
    </Watermark>
  </div>
{/if}

{#if story === 'Interactive overlay'}
  <Watermark
    content="PREVIEW ONLY"
    interactive={true}
    opacity={0.15}
    rotate={-20}
    fontSize={18}
    class="rounded-lg border p-6"
  >
    <Button variant="outline" size="sm">Try clicking — blocked</Button>
  </Watermark>
{/if}

{#if story === 'Image watermark'}
  <Watermark
    image="https://unavatar.io/twitter/shadcn"
    gap={120}
    opacity={0.3}
    rotate={-15}
    class="rounded-lg border p-8"
  >
    <p class="text-sm">Branded content with a repeating avatar watermark.</p>
  </Watermark>
{/if}
