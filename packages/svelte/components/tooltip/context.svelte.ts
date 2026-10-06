import { getContext, setContext } from 'svelte'

let tooltipCounter = 0

export class TooltipProviderState {
  delayDuration = $state(700)
  skipDelayDuration = $state(300)
  /** Timestamp of the last tooltip close, for skip-delay behavior. */
  lastCloseAt = $state(0)
}

const TOOLTIP_PROVIDER_KEY = Symbol('TooltipProvider')

export function setTooltipProviderState(state: TooltipProviderState) {
  setContext(TOOLTIP_PROVIDER_KEY, state)
}

export function getTooltipProviderState(): TooltipProviderState | undefined {
  return getContext<TooltipProviderState | undefined>(TOOLTIP_PROVIDER_KEY)
}

export class TooltipRootState {
  id = `tooltip-${++tooltipCounter}`
  open = $state(false)
  provider: TooltipProviderState | undefined = undefined
  onOpenChange: ((open: boolean) => void) | undefined = undefined
  private openTimer: ReturnType<typeof setTimeout> | null = null

  setOpen(next: boolean) {
    this.clearTimer()
    if (this.open === next) return
    if (!next && this.provider) this.provider.lastCloseAt = Date.now()
    this.open = next
    this.onOpenChange?.(next)
  }

  /** Hover entry: honor the provider delay unless another tooltip just closed. */
  scheduleOpen() {
    this.clearTimer()
    if (this.open) return
    const delay = this.provider?.delayDuration ?? 700
    const skip = this.provider?.skipDelayDuration ?? 300
    if (delay <= 0 || Date.now() - (this.provider?.lastCloseAt ?? 0) < skip) {
      this.setOpen(true)
      return
    }
    this.openTimer = setTimeout(() => this.setOpen(true), delay)
  }

  cancelScheduledOpen() {
    this.clearTimer()
    this.setOpen(false)
  }

  clearTimer() {
    if (this.openTimer) {
      clearTimeout(this.openTimer)
      this.openTimer = null
    }
  }
}

const TOOLTIP_ROOT_KEY = Symbol('TooltipRoot')

export function setTooltipRootState(state: TooltipRootState) {
  setContext(TOOLTIP_ROOT_KEY, state)
}

export function getTooltipRootState(): TooltipRootState | undefined {
  return getContext<TooltipRootState | undefined>(TOOLTIP_ROOT_KEY)
}
