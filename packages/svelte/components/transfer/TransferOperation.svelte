<script lang="ts" module>
  export interface TransferOperationProps {
    canMoveRight: boolean
    canMoveLeft: boolean
    oneWay?: boolean
    onmoveright?: () => void
    onmoveleft?: () => void
  }
</script>

<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'

  let { canMoveRight, canMoveLeft, oneWay = false, onmoveright, onmoveleft }: TransferOperationProps = $props()
</script>

<div class="flex flex-col items-center justify-center gap-2 px-2">
  <Button
    size="icon-sm"
    variant="outline"
    disabled={!canMoveRight}
    aria-label="Move selected to right"
    onclick={() => onmoveright?.()}
  >
    <ChevronRight aria-hidden="true" />
  </Button>
  {#if !oneWay}
    <Button
      size="icon-sm"
      variant="outline"
      disabled={!canMoveLeft}
      aria-label="Move selected to left"
      onclick={() => onmoveleft?.()}
    >
      <ChevronLeft aria-hidden="true" />
    </Button>
  {/if}
</div>
