<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TagsInputProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled tag list. Bind with `bind:value`. */
    value?: string[]
    /** Initial tags for uncontrolled usage. */
    defaultValue?: string[]
    disabled?: boolean
    /** Placeholder for the inner input (React parity; the input prop still wins when set). */
    placeholder?: string
    /** Split pasted text on whitespace and add each token. */
    addOnPaste?: boolean
    /** Also commit the input when it blurs. */
    addOnBlur?: boolean
    /** Keys that commit the typed value into a tag. Defaults to Enter + comma (React parity). */
    addOnKeys?: string[]
    /** Commit the input when this character is typed (in addition to Enter).
     * @deprecated Use `addOnKeys`. Kept as an alias — both stay functional. */
    delimiter?: string
    /** Reject duplicate tags (case-sensitive). Defaults to true (React parity). */
    unique?: boolean
    /** Maximum number of tags. */
    max?: number
    ref?: HTMLDivElement | null
    onValueChange?: (value: string[]) => void
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { setTagsInputContext } from './context'

  let {
    class: className,
    defaultValue = [],
    value = $bindable(defaultValue),
    disabled = false,
    placeholder,
    addOnPaste = false,
    addOnBlur = false,
    addOnKeys,
    delimiter,
    unique = true,
    max,
    children,
    ref = $bindable(null),
    onValueChange,
    ...restProps
  }: TagsInputProps = $props()

  const commitKeys = $derived.by((): string[] => {
    if (addOnKeys) return addOnKeys
    if (delimiter) return [...new Set(['Enter', delimiter])]
    return ['Enter', ',']
  })

  function commit(next: string[]) {
    value = next
    onValueChange?.(next)
  }

  function addValue(raw: string) {
    if (disabled) return
    const trimmed = raw.trim()
    if (!trimmed) return
    const current = value ?? []
    if (unique && current.includes(trimmed)) return
    if (max !== undefined && current.length >= max) return
    commit([...current, trimmed])
  }

  function removeValue(target: string) {
    if (disabled) return
    commit((value ?? []).filter((v) => v !== target))
  }

  function removeLast() {
    if (disabled) return
    const current = value ?? []
    if (current.length === 0) return
    commit(current.slice(0, -1))
  }

  setTagsInputContext({
    values: () => value ?? [],
    disabled: () => disabled,
    addValue,
    removeValue,
    removeLast,
    addOnPaste: () => addOnPaste,
    addOnBlur: () => addOnBlur,
    delimiter: () => delimiter,
    commitKeys: () => commitKeys,
    placeholder: () => placeholder,
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="tags-input"
  data-disabled={disabled || undefined}
  class={cn(
    'border-input bg-background flex flex-wrap items-center gap-2 rounded-md border px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
    'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    disabled && 'cursor-not-allowed opacity-60',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
