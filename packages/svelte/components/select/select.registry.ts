import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'select',
  type: 'registry:ui',
  categories: ['control'],
  framework: 'svelte',
  description:
    'Dropdown select primitive — single-select with optional groups, descriptions per item, an accessible hand-rolled listbox (no headless dependency), and zero-JS styled NativeSelect for lightweight/mobile use.',
  files: [
    { path: 'Select.svelte', target: 'components/ui/select/Select.svelte' },
    { path: 'SelectContent.svelte', target: 'components/ui/select/SelectContent.svelte' },
    { path: 'SelectGroup.svelte', target: 'components/ui/select/SelectGroup.svelte' },
    { path: 'SelectItem.svelte', target: 'components/ui/select/SelectItem.svelte' },
    { path: 'SelectItemText.svelte', target: 'components/ui/select/SelectItemText.svelte' },
    { path: 'SelectLabel.svelte', target: 'components/ui/select/SelectLabel.svelte' },
    { path: 'SelectScrollDownButton.svelte', target: 'components/ui/select/SelectScrollDownButton.svelte' },
    { path: 'SelectScrollUpButton.svelte', target: 'components/ui/select/SelectScrollUpButton.svelte' },
    { path: 'SelectSeparator.svelte', target: 'components/ui/select/SelectSeparator.svelte' },
    { path: 'SelectTrigger.svelte', target: 'components/ui/select/SelectTrigger.svelte' },
    { path: 'SelectValue.svelte', target: 'components/ui/select/SelectValue.svelte' },
    { path: 'NativeSelect.svelte', target: 'components/ui/select/NativeSelect.svelte' },
    { path: 'index.ts', target: 'components/ui/select/index.ts' },
    { path: 'option-types.ts', target: 'components/ui/select/option-types.ts' },
    { path: 'select-context.ts', target: 'components/ui/select/select-context.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
