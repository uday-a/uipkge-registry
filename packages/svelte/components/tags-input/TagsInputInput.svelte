<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements'

  export interface TagsInputInputProps extends HTMLInputAttributes {
    ref?: HTMLInputElement | null
  }
</script>

<script lang="ts">
  import type { ClipboardEventHandler, FocusEventHandler, KeyboardEventHandler } from 'svelte/elements'
  import { cn } from '$lib/utils'
  import { getTagsInputContext } from './context'

  let {
    class: className,
    disabled,
    placeholder,
    ref = $bindable(null),
    onkeydown,
    onpaste,
    onblur,
    ...restProps
  }: TagsInputInputProps = $props()

  const ctx = getTagsInputContext()
  const isDisabled = $derived(disabled ?? ctx?.disabled() ?? false)
  const effectivePlaceholder = $derived(placeholder ?? ctx?.placeholder())

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    onkeydown?.(event)
    if (event.defaultPrevented || isDisabled) return
    const input = event.currentTarget
    const commitKeys = ctx?.commitKeys() ?? ['Enter', ',']
    if (commitKeys.includes(event.key)) {
      event.preventDefault()
      if (input.value) {
        ctx?.addValue(input.value)
        input.value = ''
      }
    } else if (event.key === 'Backspace' && input.value === '') {
      event.preventDefault()
      ctx?.removeLast()
    }
  }

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    onpaste?.(event)
    if (event.defaultPrevented || isDisabled || !ctx?.addOnPaste()) return
    const text = event.clipboardData?.getData('text')
    if (!text) return
    event.preventDefault()
    const delimiter = ctx.delimiter()
    const tokens = delimiter ? text.split(delimiter) : text.split(/\s+/)
    for (const token of tokens) ctx.addValue(token)
    event.currentTarget.value = ''
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    onblur?.(event)
    if (event.defaultPrevented || isDisabled || !ctx?.addOnBlur()) return
    if (event.currentTarget.value) {
      ctx.addValue(event.currentTarget.value)
      event.currentTarget.value = ''
    }
  }
</script>

<input
  bind:this={ref}
  data-uipkge=""
  data-slot="tags-input-input"
  disabled={isDisabled}
  aria-label="Add a tag"
  placeholder={effectivePlaceholder}
  class={cn('min-h-5 flex-1 bg-transparent px-1 text-sm focus:outline-none', className)}
  onkeydown={handleKeydown}
  onpaste={handlePaste}
  onblur={handleBlur}
  {...restProps}
/>
