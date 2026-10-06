<script lang="ts" module>
  import type { HTMLFormAttributes } from 'svelte/elements'
  import type { TanstackFormApi } from './context'

  export interface FormProps extends HTMLFormAttributes {
    /** TanStack form instance from `createForm`. Structural divergence from
     *  React is intentional: React's `Form` is a react-hook-form
     *  `FormProvider` (no DOM, methods spread by the consumer), while Svelte
     *  renders the `<form>` itself and takes the instance as a prop. */
    form: TanstackFormApi
    ref?: HTMLFormElement | null
  }
</script>

<script lang="ts">
  import { setContext, untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { FORM_INSTANCE_CONTEXT_KEY } from './context'

  let { class: className, form, children, ref = $bindable(null), ...restProps }: FormProps = $props()

  // `untrack` — the form object identity is stable for the component's
  // lifetime (created once by `createForm`), so initial capture is correct.
  setContext(FORM_INSTANCE_CONTEXT_KEY, untrack(() => form))

  function onSubmit(e: SubmitEvent) {
    e.preventDefault()
    e.stopPropagation()
    void form.handleSubmit()
  }
</script>

<form bind:this={ref} data-uipkge data-slot="form" class={cn(className)} onsubmit={onSubmit} {...restProps}>
  {@render children?.()}
</form>
