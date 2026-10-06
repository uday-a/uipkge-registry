import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'menubar',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Top-level menu bar — File / Edit / View — for desktop-style apps. Same primitives as Dropdown Menu but laid out horizontally and keyboard-navigable across siblings (left/right arrows).',
  files: [
    { path: 'Menubar.svelte', target: 'components/ui/menubar/Menubar.svelte' },
    { path: 'MenubarCheckboxItem.svelte', target: 'components/ui/menubar/MenubarCheckboxItem.svelte' },
    { path: 'MenubarContent.svelte', target: 'components/ui/menubar/MenubarContent.svelte' },
    { path: 'MenubarContext.ts', target: 'components/ui/menubar/MenubarContext.ts' },
    { path: 'MenubarGroup.svelte', target: 'components/ui/menubar/MenubarGroup.svelte' },
    { path: 'MenubarItem.svelte', target: 'components/ui/menubar/MenubarItem.svelte' },
    { path: 'MenubarLabel.svelte', target: 'components/ui/menubar/MenubarLabel.svelte' },
    { path: 'MenubarMenu.svelte', target: 'components/ui/menubar/MenubarMenu.svelte' },
    { path: 'MenubarRadioGroup.svelte', target: 'components/ui/menubar/MenubarRadioGroup.svelte' },
    { path: 'MenubarRadioItem.svelte', target: 'components/ui/menubar/MenubarRadioItem.svelte' },
    { path: 'MenubarSeparator.svelte', target: 'components/ui/menubar/MenubarSeparator.svelte' },
    { path: 'MenubarShortcut.svelte', target: 'components/ui/menubar/MenubarShortcut.svelte' },
    { path: 'MenubarSub.svelte', target: 'components/ui/menubar/MenubarSub.svelte' },
    { path: 'MenubarSubContent.svelte', target: 'components/ui/menubar/MenubarSubContent.svelte' },
    { path: 'MenubarSubTrigger.svelte', target: 'components/ui/menubar/MenubarSubTrigger.svelte' },
    { path: 'MenubarTrigger.svelte', target: 'components/ui/menubar/MenubarTrigger.svelte' },
    { path: 'MenubarPortal.svelte', target: 'components/ui/menubar/MenubarPortal.svelte' },
    { path: 'index.ts', target: 'components/ui/menubar/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  // Hand-rolled menubar state + roving focus with runes (no bits-ui in the
  // Svelte registry yet); behaviour mirrors the reka-ui backed Vue twin:
  // single open menu, hover-switch, arrows/Escape/Tab, sub flyouts.
  registryDependencies: [],
})
