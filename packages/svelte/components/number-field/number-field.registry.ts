import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'number-field',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Numeric input with stepper buttons, min/max bounds, step size, and decimal precision. Use for quantities, prices, and any field that should be a number rather than free text.',
  files: [
    { path: 'NumberField.svelte', target: 'components/ui/number-field/NumberField.svelte' },
    { path: 'NumberFieldContent.svelte', target: 'components/ui/number-field/NumberFieldContent.svelte' },
    { path: 'NumberFieldContext.ts', target: 'components/ui/number-field/NumberFieldContext.ts' },
    { path: 'NumberFieldDecrement.svelte', target: 'components/ui/number-field/NumberFieldDecrement.svelte' },
    { path: 'NumberFieldIncrement.svelte', target: 'components/ui/number-field/NumberFieldIncrement.svelte' },
    { path: 'NumberFieldInput.svelte', target: 'components/ui/number-field/NumberFieldInput.svelte' },
    { path: 'index.ts', target: 'components/ui/number-field/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  // Hand-rolled spinbutton state with runes (no bits-ui in the Svelte registry
  // yet); behaviour mirrors the reka-ui backed Vue twin.
  registryDependencies: [],
})
