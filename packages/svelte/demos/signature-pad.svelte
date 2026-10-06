<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { SignaturePad } from '@svelte-registry/signature-pad'
  import { Check, Download, Eraser } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let signature: string | null = $state(null)
  let penColor = $state('#1d4ed8')
  let bgColor = $state('#eff6ff')
  let penThickness = $state(3)
  let padRef: {
    clear?: () => void
    exportSignature?: () => void
    isEmpty?: () => boolean
    getPointCount?: () => number
  } | null = $state(null)
  let emptyTick = $state(0)
</script>

{#if story === 'Default pad'}
  <div class="max-w-md space-y-3">
    <SignaturePad bind:value={signature} class="w-full" />
    {#if signature}
      <p class="flex items-center gap-1 text-xs text-emerald-600">
        <Check class="size-3.5" /> Captured
      </p>
    {/if}
  </div>
{/if}

{#if story === 'Styled ink'}
  <div class="max-w-md">
    <SignaturePad penColor="#1d4ed8" penThickness={3} backgroundColor="#eff6ff" class="w-full" />
  </div>
{/if}

{#if story === 'Live config'}
  <div class="max-w-md space-y-4">
    <div class="flex flex-wrap items-center gap-4 text-sm">
      <label class="flex items-center gap-2">
        Pen
        <input bind:value={penColor} type="color" class="size-7 cursor-pointer rounded border" />
      </label>
      <label class="flex items-center gap-2">
        BG
        <input bind:value={bgColor} type="color" class="size-7 cursor-pointer rounded border" />
      </label>
      <label class="flex items-center gap-2">
        Thickness
        <input
          value={penThickness}
          type="range"
          min="1"
          max="6"
          class="w-28"
          oninput={(e) => (penThickness = +(e.currentTarget as HTMLInputElement).value)}
        />
        <span class="text-muted-foreground tabular-nums">{penThickness}</span>
      </label>
    </div>
    <SignaturePad
      bind:value={signature}
      penColor={penColor}
      penThickness={penThickness}
      backgroundColor={bgColor}
      class="w-full"
    />
    {#if signature}
      <p class="flex items-center gap-1 text-xs text-emerald-600">
        <Check class="size-3.5" /> Captured
      </p>
    {/if}
  </div>
{/if}

{#if story === 'Programmatic control'}
  <div class="max-w-md space-y-3">
    <SignaturePad
      bind:this={padRef}
      bind:value={signature}
      showClearButton={false}
      class="w-full"
      onchange={() => (emptyTick += 1)}
    />
    <div class="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onclick={() => {
          padRef?.clear()
          emptyTick += 1
        }}
      >
        <Eraser class="size-4" />
        Clear
      </Button>
      <Button size="sm" onclick={() => padRef?.exportSignature()}>
        <Download class="size-4" />
        Export
      </Button>
    </div>
    <p class="text-muted-foreground text-xs">
      {#key emptyTick}
        Empty: {padRef?.isEmpty() ? 'yes' : 'no'} · Points: {padRef?.getPointCount() ?? 0}
      {/key}
    </p>
  </div>
{/if}

{#if story === 'States'}
  <div class="max-w-md space-y-3">
    <SignaturePad bind:value={signature} disabled class="w-full" />
    <SignaturePad bind:value={signature} readonly class="w-full" />
  </div>
{/if}

{#if story === 'In context: Contract signing'}
  <div class="max-w-md space-y-4 rounded-xl border p-4">
    <div>
      <h4 class="text-sm font-semibold">Consulting agreement</h4>
      <p class="text-muted-foreground text-xs">
        By signing below you agree to the 12-month payment schedule outlined in section 4.
      </p>
    </div>
    <SignaturePad bind:value={signature} showClearButton={false} class="w-full">
      {#snippet actions({ clear, empty })}
        <div class="flex items-center justify-end gap-2 pt-2">
          <Button size="sm" variant="ghost" onclick={clear} disabled={empty}>Clear</Button>
          <Button size="sm" disabled={empty || !signature}>Sign & submit</Button>
        </div>
      {/snippet}
    </SignaturePad>
  </div>
{/if}
