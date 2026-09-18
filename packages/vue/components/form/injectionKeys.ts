import type { ComputedRef, InjectionKey } from 'vue'

export const FORM_ITEM_INJECTION_KEY = Symbol() as InjectionKey<string>

export interface FormFieldContext {
  name: string
  error: ComputedRef<string | undefined>
  valid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isTouched: ComputedRef<boolean>
}

export const FORM_FIELD_INJECTION_KEY = Symbol() as InjectionKey<FormFieldContext>

export interface TanstackFormApi {
  Field: unknown
  handleSubmit: () => void | Promise<void>
}

export const FORM_INSTANCE_INJECTION_KEY = Symbol() as InjectionKey<TanstackFormApi>
