<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { useFormField } from './useFormField'

  let { class: className, children, ref = $bindable(null), ...restProps }: FormMessageProps = $props()

  const { error, formMessageId } = useFormField()
</script>

{#if error()}
  <p
    bind:this={ref}
    id={formMessageId()}
    data-uipkge
    data-slot="form-message"
    role="alert"
    class={cn('text-destructive text-sm', className)}
    {...restProps}
  >
    {error()}
  </p>
{/if}
