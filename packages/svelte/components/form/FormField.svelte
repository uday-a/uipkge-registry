<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { TanstackFormApi } from './context'
  import type { FormFieldBinding } from './FormFieldInner.svelte'

  export interface FormFieldProps {
    form?: TanstackFormApi
    name: string
    validators?: Record<string, unknown>
    children?: Snippet<[FormFieldBinding]>
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import FormFieldInner from './FormFieldInner.svelte'
  import { FORM_INSTANCE_CONTEXT_KEY } from './context'

  let { form, name, validators, children }: FormFieldProps = $props()

  const injected = getContext<TanstackFormApi | undefined>(FORM_INSTANCE_CONTEXT_KEY)

  const resolvedForm = $derived.by(() => {
    const f = form ?? injected
    if (!f) throw new Error('<FormField> requires a `form` prop or to be nested inside <Form form={...}>')
    return f
  })

  const Field = $derived(resolvedForm.Field)
</script>

<Field {name} {validators}>
  {#snippet children(field: any)}
    <FormFieldInner {field}>
      {#snippet children(binding)}
        {@render children?.(binding)}
      {/snippet}
    </FormFieldInner>
  {/snippet}
</Field>
