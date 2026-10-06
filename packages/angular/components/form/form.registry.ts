import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'form',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Form parts for Angular reactive forms (the shadcn / react-hook-form API): uiForm + uiFormField publish the field, and FormItem / FormLabel / FormControl / FormDescription / FormMessage wire ids, aria-describedby / aria-invalid and error text automatically. Plus FormSection, FormActions and FormStatus helpers.',
  files: [
    { path: 'form.component.ts', target: 'components/ui/form/form.component.ts' },
    { path: 'index.ts', target: 'components/ui/form/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/label.json', 'https://uipkge.dev/r/popper.json'],
})
