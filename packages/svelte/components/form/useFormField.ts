import { getContext } from 'svelte'
import { FORM_FIELD_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY, type FormFieldContext } from './context'

export function useFormField() {
  const fieldContext = getContext<FormFieldContext | undefined>(FORM_FIELD_CONTEXT_KEY)
  const getItemId = getContext<(() => string | undefined) | undefined>(FORM_ITEM_CONTEXT_KEY)

  if (!fieldContext) throw new Error('useFormField should be used within <FormField>')

  // Id getters (not plain strings): FormItem assigns its id in onMount so SSR
  // markup stays identical between server and client. Call these inside
  // `$derived` or the template and they track the assignment.
  const formItemId = () => `${getItemId?.()}-form-item`
  const formDescriptionId = () => `${getItemId?.()}-form-item-description`
  const formMessageId = () => `${getItemId?.()}-form-item-message`

  return {
    id: getItemId,
    name: () => fieldContext.name,
    formItemId,
    formDescriptionId,
    formMessageId,
    valid: fieldContext.valid,
    isDirty: fieldContext.isDirty,
    isTouched: fieldContext.isTouched,
    error: fieldContext.error,
  }
}
