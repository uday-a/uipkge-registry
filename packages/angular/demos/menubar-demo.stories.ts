import type { AngularStory } from './stories'

/** Story cards for the menubar Angular demo (titles + descriptions mirror demos/react/menubar.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Horizontal menubar with File, Edit, and View menus and keyboard shortcut hints.',
  },
  {
    title: 'With checkbox items',
    description: 'MenubarCheckboxItem holds a v-model:checked toggle so options stay sticky between opens.',
  },
  {
    title: 'With radio group',
    description: 'MenubarRadioGroup binds a single value across multiple MenubarRadioItem entries.',
  },
  {
    title: 'With submenu',
    description: 'MenubarSub + MenubarSubTrigger + MenubarSubContent open a nested flyout on hover.',
  },
  {
    title: 'With shortcuts',
    description: 'MenubarShortcut right-aligns a hint string with a muted style.',
  },
  {
    title: 'Full app menubar',
    description: 'Five top-level menus mixing items, separators, submenus, checkboxes, and shortcuts.',
  },
]
