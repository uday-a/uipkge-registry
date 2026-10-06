<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type QRCodeType = 'canvas' | 'svg'
  export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'
  export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

  export interface QRCodeProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    type?: QRCodeType
    size?: number
    color?: string
    bgColor?: string
    icon?: string
    iconSize?: number | { width: number; height: number }
    errorLevel?: QRCodeErrorLevel
    bordered?: boolean
    status?: QRCodeStatus
    marginSize?: number
    /** Replaces the default download button (parity with the Vue `extra` slot). */
    extra?: Snippet
    /** Fired when the expired overlay's Refresh button is clicked. */
    onrefresh?: () => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { toDataURL, toString as qrToString } from 'qrcode'
  import { Check, Loader2, RotateCcw, ScanLine } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    value,
    type = 'canvas',
    size = 160,
    // qrcode requires resolvable hex/rgb — CSS vars like var(--foreground) throw.
    color = '#000000',
    bgColor = '#ffffff',
    icon,
    iconSize,
    errorLevel = 'M',
    bordered = true,
    status = 'active',
    marginSize = 0,
    extra,
    onrefresh,
    ref = $bindable(null),
    ...restProps
  }: QRCodeProps = $props()

  let qrDataUrl = $state('')
  let qrSvg = $state('')

  const iconDimensions = $derived(
    typeof iconSize === 'number'
      ? { width: iconSize, height: iconSize }
      : (iconSize ?? { width: 40, height: 40 }),
  )

  async function generateQR() {
    if (!value || status === 'loading') return

    try {
      const options = {
        width: size,
        margin: marginSize,
        color: {
          dark: color,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      }

      if (type === 'svg') {
        qrSvg = await qrToString(value, {
          type: 'svg',
          ...options,
        })
      } else {
        qrDataUrl = await toDataURL(value, options)
      }
    } catch (e) {
      console.error('QR Code generation failed:', e)
    }
  }

  // Regenerate whenever any input changes (parity with Vue's immediate watcher).
  $effect(() => {
    void generateQR()
  })

  function downloadQR() {
    const link = document.createElement('a')
    link.download = `qrcode-${value.slice(0, 20)}.png`
    link.href = qrDataUrl
    link.click()
  }

  const statusOverlay = $derived(
    status === 'expired'
      ? { Icon: RotateCcw, text: 'Expired', action: true }
      : status === 'scanned'
        ? { Icon: Check, text: 'Scanned', action: false }
        : status === 'loading'
          ? { Icon: Loader2, text: 'Loading...', action: false }
          : null,
  )
</script>

<div
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="qr-code"
  aria-busy={status === 'loading' || undefined}
  class={cn('inline-flex flex-col items-center gap-2', bordered && 'bg-background rounded-lg border p-4', className)}
>
  <div class="relative inline-flex items-center justify-center overflow-hidden" style:width={`${size}px`} style:height={`${size}px`}>
    <!-- QR Code -->
    {#if type === 'svg' && qrSvg}
      <div class="size-full">{@html qrSvg}</div>
    {:else if qrDataUrl}
      <img src={qrDataUrl} alt={`QR Code for ${value}`} class="size-full" />
    {/if}

    <!-- Icon overlay -->
    {#if icon && status === 'active'}
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="bg-background overflow-hidden rounded-md shadow-sm"
          style:width={`${iconDimensions.width}px`}
          style:height={`${iconDimensions.height}px`}
        >
          <img src={icon} alt="" class="size-full object-cover" />
        </div>
      </div>
    {/if}

    <!-- Status overlay -->
    {#if statusOverlay}
      {@const StatusIcon = statusOverlay.Icon}
      <div class="bg-background/90 absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
        <StatusIcon class={cn('size-8', status === 'loading' && 'animate-spin')} />
        <span class="text-foreground text-sm font-medium">{statusOverlay.text}</span>
        {#if statusOverlay.action}
          <button
            type="button"
            class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
            onclick={() => onrefresh?.()}
          >
            <ScanLine class="size-3" />
            Refresh
          </button>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Download button -->
  {#if extra}
    {@render extra()}
  {:else if type === 'canvas' && status === 'active' && qrDataUrl}
    <button
      type="button"
      class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
      onclick={downloadQR}
    >
      Download
    </button>
  {/if}
</div>
