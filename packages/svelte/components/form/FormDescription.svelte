<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { useFormField } from './useFormField'

  let { class: className, children, ref = $bindable(null), ...restProps }: FormDescriptionProps = $props()

  const { formDescriptionId } = useFormField()
</script>

<p
  bind:this={ref}
  id={formDescriptionId()}
  data-uipkge
  data-slot="form-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...restProps}
>
  {@render children?.()}
</p>
