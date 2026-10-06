import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'form',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Zod-first form block built on TanStack Svelte Form. Wires field labels, descriptions, error messages, and validation together; bind a field once and the rest is automatic.',
  files: [
    { path: 'Form.svelte', target: 'components/ui/form/Form.svelte' },
    { path: 'FormActions.svelte', target: 'components/ui/form/FormActions.svelte' },
    { path: 'FormControl.svelte', target: 'components/ui/form/FormControl.svelte' },
    { path: 'FormDescription.svelte', target: 'components/ui/form/FormDescription.svelte' },
    { path: 'FormField.svelte', target: 'components/ui/form/FormField.svelte' },
    { path: 'FormFieldInner.svelte', target: 'components/ui/form/FormFieldInner.svelte' },
    { path: 'FormItem.svelte', target: 'components/ui/form/FormItem.svelte' },
    { path: 'FormLabel.svelte', target: 'components/ui/form/FormLabel.svelte' },
    { path: 'FormMessage.svelte', target: 'components/ui/form/FormMessage.svelte' },
    { path: 'FormSection.svelte', target: 'components/ui/form/FormSection.svelte' },
    { path: 'FormStatus.svelte', target: 'components/ui/form/FormStatus.svelte' },
    { path: 'index.ts', target: 'components/ui/form/index.ts' },
    { path: 'context.ts', target: 'components/ui/form/context.ts' },
    { path: 'types.ts', target: 'components/ui/form/types.ts' },
    { path: 'useFormField.ts', target: 'components/ui/form/useFormField.ts' },
  ],
  dependencies: ['@tanstack/svelte-form', '@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/label.json'],
})
