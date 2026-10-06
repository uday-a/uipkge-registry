<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface FieldMeta {
    errors: Array<unknown>
    errorMap?: Record<string, Array<unknown> | undefined>
    isDirty: boolean
    isTouched: boolean
    isValid: boolean
  }

  export interface FieldApi {
    name: string
    state: {
      value: unknown
      meta: FieldMeta
    }
    handleChange: (v: unknown) => void
    handleBlur: () => void
  }

  /** Spread onto a text-like control (`<Input {...componentField} />`). For
   *  selects, checkboxes, or custom controls, wire `field.handleChange` /
   *  `field.handleBlur` manually — also exposed on the binding. */
  export interface ComponentField {
    name: string
    // `any` (not `unknown`) so `<Input {...componentField} />` spreads without
    // a cast at every call site — TanStack field values are form-typed at the
    // `createForm` call, which this structural binding cannot see.
    value: any
    oninput: (e: Event) => void
    onblur: () => void
  }

  export interface FormFieldBinding {
    field: FieldApi
    componentField: ComponentField
    error: string | undefined
    valid: boolean
    isDirty: boolean
    isTouched: boolean
  }

  export interface FormFieldInnerProps {
    field: FieldApi
    children?: Snippet<[FormFieldBinding]>
  }
</script>

<script lang="ts">
  import { setContext, untrack } from 'svelte'
  import { FORM_FIELD_CONTEXT_KEY } from './context'

  let { field, children }: FormFieldInnerProps = $props()

  function formatError(raw: unknown): string {
    if (typeof raw === 'string') return raw
    if (raw && typeof raw === 'object' && 'message' in raw) {
      return String((raw as { message: unknown }).message)
    }
    return String(raw)
  }

  // @tanstack/svelte-form state is runes-reactive, so plain `$derived`
  // reads track value/meta updates — no manual store subscription needed
  // (unlike the Vue twin, which snapshots via `store.subscribe`).
  const error = $derived.by(() => {
    const meta = field.state.meta
    const flat = meta.errors
    if (Array.isArray(flat) && flat.length > 0 && flat[0] != null) {
      return formatError(flat[0])
    }
    const map = meta.errorMap ?? {}
    for (const key of Object.keys(map)) {
      const arr = map[key]
      if (Array.isArray(arr) && arr.length > 0 && arr[0] != null) {
        return formatError(arr[0])
      }
    }
    return undefined
  })

  const valid = $derived(field.state.meta.isValid)
  const isDirty = $derived(field.state.meta.isDirty)
  const isTouched = $derived(field.state.meta.isTouched)

  setContext(FORM_FIELD_CONTEXT_KEY, {
    // `untrack` — the field name is static; error/valid/dirty/touched stay
    // reactive through the getter closures below.
    name: untrack(() => field.name),
    error: () => error,
    valid: () => valid,
    isDirty: () => isDirty,
    isTouched: () => isTouched,
  })

  const componentField = $derived<ComponentField>({
    value: field.state.value,
    oninput: (e: Event) => field.handleChange((e.target as HTMLInputElement).value),
    onblur: () => field.handleBlur(),
    name: field.name,
  })

  const binding = $derived<FormFieldBinding>({ field, componentField, error, valid, isDirty, isTouched })
</script>

{@render children?.(binding)}
