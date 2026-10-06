<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type AlertModalTone = 'default' | 'destructive' | 'success' | 'warning'
  export type AlertModalIcon = 'info' | 'warning' | 'error' | 'success'

  export interface AlertModalProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled open state. Pair with `bind:open`. */
    open?: boolean
    /** Uncontrolled initial open state. */
    defaultOpen?: boolean
    /** Title rendered in the header. Override with the `titleSnippet`. */
    title?: string
    /** Description rendered under the title. Override with the `descriptionSnippet`. */
    description?: string
    /** Label for the primary action button. */
    actionLabel?: string
    /** Label for the cancel button. Pass null to hide. */
    cancelLabel?: string | null
    /** Visual tone — colors the icon and action button. */
    tone?: AlertModalTone
    /** Quick icon shortcut. Override with the `iconSnippet`. */
    icon?: AlertModalIcon | null
    /** Show a spinner on the action button and disable both buttons. */
    loading?: boolean
    /** Disable the primary action without a spinner. */
    actionDisabled?: boolean
    /** Clicking the trigger snippet content opens the dialog. */
    trigger?: Snippet
    iconSnippet?: Snippet
    titleSnippet?: Snippet
    descriptionSnippet?: Snippet
    actions?: Snippet
    ref?: HTMLDivElement | null
    onOpenChange?: (open: boolean) => void
    onAction?: (event: MouseEvent) => void
    onCancel?: (event: MouseEvent) => void
  }
</script>

<script lang="ts">
  import { CircleAlert, CircleCheck, Info, TriangleAlert } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import { cn } from '$lib/utils'

  let {
    open = $bindable(),
    defaultOpen = false,
    title = '',
    description = '',
    actionLabel = 'Continue',
    cancelLabel = 'Cancel',
    tone = 'default',
    icon,
    loading = false,
    actionDisabled = false,
    trigger,
    iconSnippet,
    titleSnippet,
    descriptionSnippet,
    actions,
    class: className,
    children,
    ref = $bindable(null),
    onOpenChange,
    onAction,
    onCancel,
    ...restProps
  }: AlertModalProps = $props()

  // Sync internal state with bind:open and emit changes back out so the
  // component works in both controlled and uncontrolled modes.
  // Snapshot once: later `defaultOpen` changes must not reopen a user-closed dialog.
  const getInitialOpen = () => open ?? defaultOpen
  let internalOpen = $state(getInitialOpen())

  $effect.pre(() => {
    if (open !== undefined) internalOpen = open
  })

  const isOpen = $derived(internalOpen)

  function setOpen(v: boolean) {
    // Keep the dialog open while an async action is in flight.
    if (!v && loading) return
    internalOpen = v
    open = v
    onOpenChange?.(v)
  }

  const ResolvedIcon = $derived.by(() => {
    switch (icon) {
      case 'info':
        return Info
      case 'success':
        return CircleCheck
      case 'warning':
        return TriangleAlert
      case 'error':
        return CircleAlert
      default:
        return null
    }
  })

  const iconColorClass = $derived.by(() => {
    switch (tone) {
      case 'destructive':
        return 'text-destructive'
      case 'success':
        return 'text-success'
      case 'warning':
        return 'text-warning'
      default:
        return 'text-muted-foreground'
    }
  })

  const actionToneClass = $derived.by(() => {
    switch (tone) {
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      case 'success':
        return 'bg-success text-success-foreground hover:bg-success/90'
      case 'warning':
        return 'bg-warning text-warning-foreground hover:bg-warning/90'
      default:
        return ''
    }
  })

  // Focus the panel on open (alertdialog role) and lock body scroll while open.
  $effect(() => {
    if (!isOpen || !ref) return
    ref.focus({ preventScroll: true })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  })

  function handleAction(e: MouseEvent) {
    if (loading || actionDisabled) {
      e.preventDefault()
      return
    }
    onAction?.(e)
    if (!e.defaultPrevented) setOpen(false)
  }

  function handleCancel(e: MouseEvent) {
    onCancel?.(e)
    if (!e.defaultPrevented) setOpen(false)
  }

  const dialogId = $props.id()
  const titleId = `${dialogId}-title`
  const descriptionId = `${dialogId}-description`
</script>

{#if trigger}
  <!-- Clicking (or keyboard-activating, via bubbled click) the trigger content opens the dialog. -->
  <span data-slot="alert-modal-trigger" role="presentation" onclick={() => setOpen(true)}>
    {@render trigger()}
  </span>
{/if}

{#if isOpen}
  <div
    data-uipkge=""
    data-slot="alert-modal-overlay"
    class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-neutral-900/80"
    data-state="open"
    aria-hidden="true"
  ></div>
  <div
    bind:this={ref}
    role="alertdialog"
    aria-modal="true"
    aria-labelledby={titleId}
    aria-describedby={description || descriptionSnippet ? descriptionId : undefined}
    tabindex="-1"
    data-uipkge=""
    data-slot="alert-modal"
    data-state="open"
    data-tone={tone}
    class={cn(
      'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg',
      className,
    )}
    {...restProps}
  >
    <div class="flex flex-col gap-2 text-center sm:text-left">
      {#if iconSnippet || ResolvedIcon}
        <div class={cn('bg-muted mb-2 flex size-10 items-center justify-center rounded-full', iconColorClass)}>
          {#if iconSnippet}
            {@render iconSnippet()}
          {:else if ResolvedIcon}
            <ResolvedIcon class="size-5" />
          {/if}
        </div>
      {/if}
      <div id={titleId} data-slot="alert-modal-title" class="text-lg font-semibold">
        {#if titleSnippet}
          {@render titleSnippet()}
        {:else}
          {title}
        {/if}
      </div>
      {#if description || descriptionSnippet}
        <div id={descriptionId} data-slot="alert-modal-description" class="text-muted-foreground text-sm">
          {#if descriptionSnippet}
            {@render descriptionSnippet()}
          {:else}
            {description}
          {/if}
        </div>
      {/if}
    </div>

    {#if children}
      <div class="text-sm">
        {@render children()}
      </div>
    {/if}

    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      {#if actions}
        {@render actions()}
      {:else}
        {#if cancelLabel}
          <Button variant="outline" disabled={loading} onclick={handleCancel}>
            {cancelLabel}
          </Button>
        {/if}
        <Button disabled={loading || actionDisabled} aria-busy={loading} class={actionToneClass} onclick={handleAction}>
          {#if loading}
            <span
              class="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            ></span>
          {/if}
          {actionLabel}
        </Button>
      {/if}
    </div>
  </div>
{/if}
