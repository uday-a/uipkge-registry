import type { Component } from 'svelte'

export const FORM_ITEM_CONTEXT_KEY = Symbol('form-item')

export interface FormFieldContext {
  name: string
  error: () => string | undefined
  valid: () => boolean
  isDirty: () => boolean
  isTouched: () => boolean
}

export const FORM_FIELD_CONTEXT_KEY = Symbol('form-field')

export interface TanstackFormApi {
  Field: Component<any>
  handleSubmit: () => void | Promise<void>
}

export const FORM_INSTANCE_CONTEXT_KEY = Symbol('form-instance')
