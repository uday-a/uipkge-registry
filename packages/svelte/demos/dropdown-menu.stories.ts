import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Account menu',
    description: 'Label + grouped items with separators. Destructive item uses text-destructive.',
  },
  {
    title: 'With shortcuts',
    description: 'DropdownMenuShortcut renders a right-aligned hint per item — common for editor menus.',
  },
  {
    title: 'With checkbox items',
    description: 'DropdownMenuCheckboxItem holds bind:checked state — multiple toggles can stay open across opens.',
  },
  {
    title: 'With radio group',
    description: 'DropdownMenuRadioGroup holds a single selected value across DropdownMenuRadioItem children.',
  },
  {
    title: 'With submenus',
    description: 'DropdownMenuSub + SubTrigger + SubContent build a nested cascading menu.',
  },
  {
    title: 'Icon trigger (row action)',
    description: 'Common table-row pattern — icon-only trigger that opens a small action menu.',
  },
  {
    title: 'Action menu',
    description: 'Chevron-trigger pattern for create-new menus.',
  },
]
