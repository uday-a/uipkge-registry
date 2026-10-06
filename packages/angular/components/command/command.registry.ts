import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'command',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Searchable command palette à la Cmd-K — keyboard-driven menu with grouped items, icons, shortcuts, and cmdk-style fuzzy filtering + ranking. Use as a global launcher (CommandDialog: portalled modal with focus trap) or inline as a typeahead select.',
  files: [
    { path: 'command.component.ts', target: 'components/ui/command/command.component.ts' },
    { path: 'index.ts', target: 'components/ui/command/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
