<script lang="ts" module>
  import type { HTMLLabelAttributes } from 'svelte/elements'

  export interface FormLabelProps extends HTMLLabelAttributes {
    ref?: HTMLLabelElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { Label } from '$lib/components/ui/label'
  import { useFormField } from './useFormField'

  let { class: className, children, ref = $bindable(null), ...restProps }: FormLabelProps = $props()

  const { error, formItemId } = useFormField()
</script>

<Label
  data-uipkge
  data-slot="form-label"
  data-error={!!error()}
  class={cn('data-[error=true]:text-destructive', className)}
  bind:ref
  {...restProps}
  for={formItemId()}
>
  {@render children?.()}
</Label>
