import { getContext, setContext } from 'svelte'

export type ToggleGroupType = 'single' | 'multiple'

export class ToggleGroupContextState {
  variant = $state<'default' | 'outline' | undefined>(undefined)
  size = $state<'default' | 'sm' | 'lg' | undefined>(undefined)
  spacing = $state(0)
  /** Mirrored selection for item chrome. Synced from the group's `value`. */
  value = $state<string | string[] | undefined>(undefined)
  type = $state<ToggleGroupType | undefined>(undefined)
  /** Assigned by the group during init; items call it on click. */
  select: (itemValue: string) => void = () => {}

  isSelected(itemValue: string): boolean {
    if (this.type === 'multiple') {
      return Array.isArray(this.value) ? this.value.includes(itemValue) : false
    }
    return this.value === itemValue
  }
}

const TOGGLE_GROUP_KEY = Symbol('ToggleGroupContext')

export function setToggleGroupContext(ctx: ToggleGroupContextState) {
  setContext(TOGGLE_GROUP_KEY, ctx)
}

export function getToggleGroupContext(): ToggleGroupContextState | undefined {
  return getContext<ToggleGroupContextState | undefined>(TOGGLE_GROUP_KEY)
}
