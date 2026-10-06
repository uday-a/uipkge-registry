<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface FormControlBinding {
    id: string
    'aria-describedby': string
    'aria-invalid': boolean
    /** `form-control` data-slot, applied to the child control via spread —
     *  the compat shim for React's `<Slot data-slot="form-control">`, which
     *  has no Svelte equivalent (this component renders no DOM of its own). */
    'data-slot': 'form-control'
  }

  export interface FormControlProps {
    /** Render-prop children (the Svelte counterpart of Radix `Slot`): spread
     *  the binding onto your control —
     *  `{#snippet children(props)}<Input {...props} />{/snippet}`. */
    children?: Snippet<[FormControlBinding]>
  }
</script>

<script lang="ts">
  import { useFormField } from './useFormField'

  let { children }: FormControlProps = $props()

  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  const binding = $derived<FormControlBinding>({
    id: formItemId(),
    'aria-describedby': !error() ? `${formDescriptionId()}` : `${formDescriptionId()} ${formMessageId()}`,
    'aria-invalid': !!error(),
    'data-slot': 'form-control',
  })
</script>

{@render children?.(binding)}
