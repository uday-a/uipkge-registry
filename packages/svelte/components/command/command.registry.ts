import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'command',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Searchable command palette a la Cmd-K — keyboard-driven menu with grouped items, icons, shortcuts, and filtering. Use as a global launcher (mounted in a Dialog via CommandDialog) or inline as a typeahead select. Hand-rolled runes behavior: filter, arrow/enter navigation, highlight.',
  files: [
    { path: 'Command.svelte', target: 'components/ui/command/Command.svelte' },
    { path: 'CommandDialog.svelte', target: 'components/ui/command/CommandDialog.svelte' },
    { path: 'CommandEmpty.svelte', target: 'components/ui/command/CommandEmpty.svelte' },
    { path: 'CommandGroup.svelte', target: 'components/ui/command/CommandGroup.svelte' },
    { path: 'CommandInput.svelte', target: 'components/ui/command/CommandInput.svelte' },
    { path: 'CommandItem.svelte', target: 'components/ui/command/CommandItem.svelte' },
    { path: 'CommandList.svelte', target: 'components/ui/command/CommandList.svelte' },
    { path: 'CommandSeparator.svelte', target: 'components/ui/command/CommandSeparator.svelte' },
    { path: 'CommandShortcut.svelte', target: 'components/ui/command/CommandShortcut.svelte' },
    { path: 'context.ts', target: 'components/ui/command/context.ts' },
    { path: 'index.ts', target: 'components/ui/command/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/dialog.json'],
})
