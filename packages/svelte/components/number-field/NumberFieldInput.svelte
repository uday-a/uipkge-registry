<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NumberFieldInputProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLInputElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { getNumberFieldContext } from './NumberFieldContext'

  let { class: className, ref = $bindable(null), ...restProps }: NumberFieldInputProps = $props()

  const rootContext = getNumberFieldContext()

  let inputEl: HTMLInputElement | null = $state(null)
  $effect(() => {
    ref = inputEl
  })

  let displayValue = $state('')
  let isUserTyping = $state(false)

  function updateDisplayValue(val: number | undefined) {
    displayValue = rootContext.formatValue(val)
  }

  // Mirror the Vue watchers: external value changes repaint the input unless
  // the user is mid-edit.
  $effect(() => {
    const val = rootContext.getValue()
    rootContext.getFormatter()
    if (!isUserTyping) updateDisplayValue(val)
  })

  function handleFocus() {
    isUserTyping = true
  }

  function commitValue() {
    isUserTyping = false
    const raw = displayValue.trim()

    if (raw === '') {
      rootContext.setValue(undefined)
    } else {
      const parser = rootContext.getParser()
      let num: number | undefined
      if (parser) {
        num = parser(raw)
      } else {
        num = Number(raw)
      }

      if (num !== undefined && !Number.isNaN(num)) {
        rootContext.applyInputValue(String(num))
      }
    }

    tick().then(() => {
      updateDisplayValue(rootContext.getValue())
    })
  }

  function handleBlur() {
    commitValue()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      if (rootContext.isKeyboardEnabled()) {
        event.preventDefault()
        rootContext.handleIncrease()
      }
    } else if (event.key === 'ArrowDown') {
      if (rootContext.isKeyboardEnabled()) {
        event.preventDefault()
        rootContext.handleDecrease()
      }
    } else if (event.key === 'PageUp') {
      if (rootContext.isKeyboardEnabled()) {
        event.preventDefault()
        rootContext.handleIncrease(10)
      }
    } else if (event.key === 'PageDown') {
      if (rootContext.isKeyboardEnabled()) {
        event.preventDefault()
        rootContext.handleDecrease(10)
      }
    } else if (event.key === 'Home') {
      if (rootContext.isKeyboardEnabled()) {
        event.preventDefault()
        rootContext.handleMinMaxValue('min')
      }
    } else if (event.key === 'End') {
      if (rootContext.isKeyboardEnabled()) {
        event.preventDefault()
        rootContext.handleMinMaxValue('max')
      }
    } else if (event.key === 'Enter') {
      commitValue()
    }
  }

  function handleWheel(event: WheelEvent) {
    if (rootContext.isWheelChangeDisabled()) return
    if (event.target !== document.activeElement) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    if (event.deltaY > 0) {
      rootContext.isWheelChangeInverted() ? rootContext.handleDecrease() : rootContext.handleIncrease()
    } else {
      rootContext.isWheelChangeInverted() ? rootContext.handleIncrease() : rootContext.handleDecrease()
    }
  }

  const isRight = $derived(rootContext.getControlsPosition() === 'right')
  const status = $derived(rootContext.getStatus())
  const prefix = $derived(rootContext.getPrefix())
  const suffix = $derived(rootContext.getSuffix())

  const sizeClasses = $derived.by(() => {
    switch (rootContext.getSize()) {
      case 'small':
        return 'h-7 text-xs px-2 py-0.5'
      case 'large':
        return 'h-11 text-base px-4 py-2'
      default:
        return 'h-9 text-sm px-3 py-1'
    }
  })

  const statusClasses = $derived(
    status === 'error'
      ? 'border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive'
      : status === 'warning'
        ? 'border-warning focus-visible:ring-warning/20'
        : '',
  )

  const modelValue = $derived(rootContext.getValue())
</script>

<div data-uipkge="" data-slot="input" class={cn('relative flex-1', isRight && 'col-span-1 row-span-2', className)}>
  {#if prefix}
    <span class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm">
      {prefix}
    </span>
  {/if}
  <input
    bind:this={inputEl}
    id={rootContext.getId()}
    value={displayValue}
    type="text"
    role="spinbutton"
    aria-valuenow={modelValue !== undefined && !Number.isNaN(modelValue) ? modelValue : undefined}
    aria-valuemin={rootContext.getMin()}
    aria-valuemax={rootContext.getMax()}
    inputmode={rootContext.getInputMode()}
    disabled={rootContext.isDisabled()}
    readonly={rootContext.isReadonly()}
    placeholder={rootContext.getPlaceholder()}
    aria-invalid={status === 'error' ? true : undefined}
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    aria-roledescription="Number field"
    oninput={(e) => {
      displayValue = (e.target as HTMLInputElement).value
    }}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    onwheel={handleWheel}
    class={cn(
      'placeholder:text-muted-foreground w-full bg-transparent text-center shadow-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
      !isRight && 'border-input focus-visible:ring-ring rounded-md border focus-visible:ring-1',
      isRight && 'rounded-none border-0 focus-visible:ring-0',
      prefix && 'pl-6',
      suffix && 'pr-6',
      sizeClasses,
      !isRight && statusClasses,
    )}
    {...restProps}
  />
  {#if suffix}
    <span class="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-sm">
      {suffix}
    </span>
  {/if}
</div>
