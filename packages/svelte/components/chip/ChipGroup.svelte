<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ChipGroupSlotArgs {
    selected: string[]
    multiple: boolean
    filter: boolean
    isSelected: (value: string) => boolean
    toggle: (value: string) => void
  }

  /** React parity alias — same shape as `ChipGroupSlotArgs`. */
  export type ChipGroupRenderProps = ChipGroupSlotArgs

  export interface ChipGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    selected?: string[]
    multiple?: boolean
    filter?: boolean
    column?: boolean
    mandatory?: boolean
    max?: number
    disabled?: boolean
    /** Fires when the selection changes. */
    onSelectedChange?: (value: string[]) => void
    children?: Snippet<[ChipGroupSlotArgs]>
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    selected = $bindable([]),
    multiple = false,
    filter = false,
    column = false,
    mandatory = false,
    max,
    disabled = false,
    onSelectedChange,
    children,
    ...restProps
  }: ChipGroupProps = $props()

  function isSelected(value: string) {
    return selected.includes(value)
  }

  function toggle(value: string) {
    if (disabled) return

    let newSelected: string[]

    if (multiple) {
      if (isSelected(value)) {
        newSelected = selected.filter((v) => v !== value)
      } else {
        if (max && selected.length >= max) {
          newSelected = [...selected.slice(1), value]
        } else {
          newSelected = [...selected, value]
        }
      }
    } else {
      if (isSelected(value) && !mandatory) {
        newSelected = []
      } else {
        newSelected = [value]
      }
    }

    selected = newSelected
    onSelectedChange?.(newSelected)
  }
</script>

<div
  role="group"
  data-uipkge
  data-slot="chip-group"
  data-chip-group="true"
  data-multiple={multiple || undefined}
  data-filter={filter || undefined}
  class={cn('flex flex-wrap gap-2', column && 'flex-col', className)}
  {...restProps}
>
  {@render children?.({ selected, multiple, filter, isSelected, toggle })}
</div>
