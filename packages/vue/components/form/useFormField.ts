import { computed, inject } from 'vue'
import { FORM_FIELD_INJECTION_KEY, FORM_ITEM_INJECTION_KEY } from './injectionKeys'

export function useFormField() {
  const fieldContext = inject(FORM_FIELD_INJECTION_KEY)
  const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY)

  if (!fieldContext) throw new Error('useFormField should be used within <FormField>')

  const id = fieldItemContext

  return {
    id,
    name: computed(() => fieldContext.name),
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    valid: fieldContext.valid,
    isDirty: fieldContext.isDirty,
    isTouched: fieldContext.isTouched,
    error: fieldContext.error,
  }
}
