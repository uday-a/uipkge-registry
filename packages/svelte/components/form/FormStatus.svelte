<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { FormStatus } from './types'

  export interface FormStatusProps extends HTMLAttributes<HTMLDivElement> {
    status: FormStatus
    message: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import type { Component } from 'svelte'
  import { CircleAlert, CircleCheck, TriangleAlert } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let { class: className, status, message, ref = $bindable(null), ...restProps }: FormStatusProps = $props()

  const statusConfig: Record<NonNullable<FormStatus>, { icon: Component<any>; container: string }> = {
    error: {
      icon: CircleAlert,
      container: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    warning: {
      icon: TriangleAlert,
      container: 'bg-warning/10 text-warning border-warning/30',
    },
    success: {
      icon: CircleCheck,
      container: 'bg-success/10 text-success border-success/30',
    },
  }

  const Icon = $derived(status ? statusConfig[status].icon : null)
  const containerClass = $derived(status ? statusConfig[status].container : '')
</script>

{#if status && Icon}
  <div
    bind:this={ref}
    data-uipkge
    data-slot="form-status"
    role={status === 'error' ? 'alert' : 'status'}
    class={cn('flex items-center gap-2 rounded-md border px-3 py-2 text-sm', containerClass, className)}
    {...restProps}
  >
    <Icon class="size-4 shrink-0" aria-hidden="true" />
    <span>{message}</span>
  </div>
{/if}
