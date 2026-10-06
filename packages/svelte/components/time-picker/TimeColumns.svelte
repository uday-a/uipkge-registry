<script lang="ts" module>
  export interface TimeParts {
    hour24: number
    minute: number
    second: number
  }

  export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm A'

  export interface TimeColumnsProps {
    /** Time value. HH:mm or HH:mm:ss depending on format. Empty = no selection. */
    value?: string
    use24Hour?: boolean
    use12Hours?: boolean
    minuteStep?: number
    hourStep?: number
    secondStep?: number
    /** 24h HH:mm or HH:mm:ss. */
    minTime?: string
    /** 24h HH:mm or HH:mm:ss. */
    maxTime?: string
    format?: TimeFormat
    disabledHours?: () => number[]
    disabledMinutes?: (selectedHour: number) => number[]
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
    hideDisabledOptions?: boolean
    /** Auto-scroll active rows into view when this becomes true. */
    visible?: boolean
    /** Called with the new 24h time string after every pick. */
    onValueChange?: (value: string) => void
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    value = $bindable(''),
    use24Hour = false,
    use12Hours = false,
    minuteStep = 5,
    hourStep = 1,
    secondStep = 1,
    minTime,
    maxTime,
    format = 'HH:mm',
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    hideDisabledOptions = false,
    visible = true,
    onValueChange,
  }: TimeColumnsProps = $props()

  function parse(v: string): TimeParts | null {
    if (!v) return null
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim())
    if (!m) return null
    const h = Number(m[1])
    const min = Number(m[2])
    const s = m[3] ? Number(m[3]) : 0
    if (
      Number.isNaN(h) ||
      Number.isNaN(min) ||
      Number.isNaN(s) ||
      h < 0 ||
      h > 23 ||
      min < 0 ||
      min > 59 ||
      s < 0 ||
      s > 59
    )
      return null
    return { hour24: h, minute: min, second: s }
  }

  function format24(p: TimeParts) {
    if (format === 'HH:mm:ss') {
      return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}:${String(p.second).padStart(2, '0')}`
    }
    return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
  }

  function toMinutes(p: TimeParts) {
    return p.hour24 * 60 + p.minute + p.second / 60
  }

  let parts: TimeParts | null = $state(parse(value))
  $effect(() => {
    parts = parse(value)
  })

  const showSeconds = $derived(format === 'HH:mm:ss')

  // Default to 24h columns. Opt into 12h via format="hh:mm A" or use12Hours.
  // (use24Hour remains as an explicit 24h force for API compat; it no longer
  // inverts the default when false — that made HH:mm demos show AM/PM by accident.)
  const effective12Hour = $derived.by(() => {
    if (format === 'hh:mm A') return true
    if (use12Hours) return true
    if (use24Hour) return false
    return false
  })

  const hour12 = $derived.by(() => {
    if (!parts) return null
    const h = parts.hour24 % 12
    return h === 0 ? 12 : h
  })
  const period = $derived(parts && parts.hour24 >= 12 ? 'PM' : 'AM')

  const minBound = $derived(parse(minTime ?? '') ?? null)
  const maxBound = $derived(parse(maxTime ?? '') ?? null)

  function withinBounds(p: TimeParts) {
    const m = toMinutes(p)
    if (minBound && m < toMinutes(minBound)) return false
    if (maxBound && m > toMinutes(maxBound)) return false
    return true
  }

  const disabledHoursSet = $derived(new Set(disabledHours ? disabledHours() : []))

  const disabledMinutesSet = $derived.by(() => {
    const h = parts?.hour24 ?? 0
    return new Set(disabledMinutes ? disabledMinutes(h) : [])
  })

  const disabledSecondsSet = $derived.by(() => {
    const h = parts?.hour24 ?? 0
    const m = parts?.minute ?? 0
    return new Set(disabledSeconds ? disabledSeconds(h, m) : [])
  })

  function isHourDisabledItem(h: number) {
    if (disabledHoursSet.has(h)) return true
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    if (effective12Hour) {
      const isPM = period === 'PM'
      return !withinBounds({ hour24: (h % 12) + (isPM ? 12 : 0), minute: cur.minute, second: cur.second })
    }
    return !withinBounds({ hour24: h, minute: cur.minute, second: cur.second })
  }

  function isMinuteDisabledItem(m: number) {
    if (disabledMinutesSet.has(m)) return true
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    return !withinBounds({ hour24: cur.hour24, minute: m, second: cur.second })
  }

  function isSecondDisabledItem(s: number) {
    if (disabledSecondsSet.has(s)) return true
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    return !withinBounds({ hour24: cur.hour24, minute: cur.minute, second: s })
  }

  const hours12List = $derived.by(() => {
    const step = Math.max(1, hourStep)
    const list = Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => (h - 1) % step === 0)
    if (!hideDisabledOptions) return list
    return list.filter((h) => !isHourDisabledItem(h))
  })

  const hours24List = $derived.by(() => {
    const step = Math.max(1, hourStep)
    const list = Array.from({ length: 24 }, (_, i) => i).filter((h) => h % step === 0)
    if (!hideDisabledOptions) return list
    return list.filter((h) => !isHourDisabledItem(h))
  })

  const minutesList = $derived.by(() => {
    const step = Math.max(1, Math.min(60, minuteStep))
    const list = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step)
    if (!hideDisabledOptions) return list
    return list.filter((m) => !isMinuteDisabledItem(m))
  })

  const secondsList = $derived.by(() => {
    const step = Math.max(1, Math.min(60, secondStep))
    const list = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step)
    if (!hideDisabledOptions) return list
    return list.filter((s) => !isSecondDisabledItem(s))
  })

  function commit(p: TimeParts) {
    if (!withinBounds(p)) return
    parts = p
    value = format24(p)
    onValueChange?.(value)
  }

  function pickHour12(h: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    const isPM = period === 'PM'
    commit({ hour24: (h % 12) + (isPM ? 12 : 0), minute: cur.minute, second: cur.second })
  }

  function pickHour24(h: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    commit({ hour24: h, minute: cur.minute, second: cur.second })
  }

  function pickMinute(m: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    commit({ hour24: cur.hour24, minute: m, second: cur.second })
  }

  function pickSecond(s: number) {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    commit({ hour24: cur.hour24, minute: cur.minute, second: s })
  }

  function pickPeriod(p: 'AM' | 'PM') {
    const cur = parts ?? { hour24: 0, minute: 0, second: 0 }
    const h12 = cur.hour24 % 12
    commit({ hour24: h12 + (p === 'PM' ? 12 : 0), minute: cur.minute, second: cur.second })
  }

  let hourCol: HTMLDivElement | null = $state(null)
  let minCol: HTMLDivElement | null = $state(null)
  let secCol: HTMLDivElement | null = $state(null)

  function scrollActiveIntoView() {
    for (const col of [hourCol, minCol, secCol]) {
      col?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'center' })
    }
  }

  $effect(() => {
    if (!visible) return
    tick().then(scrollActiveIntoView)
  })

  function isHourActive(h: number) {
    if (!parts) return false
    return effective12Hour ? hour12 === h : parts.hour24 === h
  }

  function isHourDisabled(h: number) {
    if (!hideDisabledOptions) return isHourDisabledItem(h)
    return false
  }

  function isMinuteDisabled(m: number) {
    if (!hideDisabledOptions) return isMinuteDisabledItem(m)
    return false
  }

  function isSecondDisabled(s: number) {
    if (!hideDisabledOptions) return isSecondDisabledItem(s)
    return false
  }

  const optionClass =
    'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent'
</script>

<div class="flex divide-x" data-uipkge="" data-slot="time-columns">
  <div bind:this={hourCol} class="h-56 overflow-y-auto">
    <div class="flex w-14 flex-col p-1">
      {#each effective12Hour ? hours12List : hours24List as h (h)}
        <button
          type="button"
          data-active={isHourActive(h)}
          disabled={isHourDisabled(h)}
          class={cn(optionClass, isHourActive(h) && 'bg-primary text-primary-foreground hover:bg-primary')}
          onclick={() => (effective12Hour ? pickHour12(h) : pickHour24(h))}
        >
          {String(h).padStart(2, '0')}
        </button>
      {/each}
    </div>
  </div>

  <div bind:this={minCol} class="h-56 overflow-y-auto">
    <div class="flex w-14 flex-col p-1">
      {#each minutesList as m (m)}
        <button
          type="button"
          data-active={parts?.minute === m}
          disabled={isMinuteDisabled(m)}
          class={cn(optionClass, parts?.minute === m && 'bg-primary text-primary-foreground hover:bg-primary')}
          onclick={() => pickMinute(m)}
        >
          {String(m).padStart(2, '0')}
        </button>
      {/each}
    </div>
  </div>

  {#if showSeconds}
    <div bind:this={secCol} class="h-56 overflow-y-auto">
      <div class="flex w-14 flex-col p-1">
        {#each secondsList as s (s)}
          <button
            type="button"
            data-active={parts?.second === s}
            disabled={isSecondDisabled(s)}
            class={cn(optionClass, parts?.second === s && 'bg-primary text-primary-foreground hover:bg-primary')}
            onclick={() => pickSecond(s)}
          >
            {String(s).padStart(2, '0')}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if effective12Hour}
    <div class="flex w-12 flex-col p-1">
      {#each ['AM', 'PM'] as p (p)}
        <button
          type="button"
          class={cn(
            'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
            period === p && 'bg-primary text-primary-foreground hover:bg-primary',
          )}
          onclick={() => pickPeriod(p as 'AM' | 'PM')}
        >
          {p}
        </button>
      {/each}
    </div>
  {/if}
</div>
