import type { AngularStory } from './stories'

/** Story cards for the context-menu Angular demo (titles + descriptions mirror demos/react/context-menu.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Right-click the target to open a menu with items and a separator.',
  },
  {
    title: 'Checkbox items',
    description: 'ContextMenuCheckboxItem with two-way bound v-model state showing the check indicator.',
  },
  {
    title: 'Radio group',
    description: 'ContextMenuRadioGroup + ContextMenuRadioItem for single-select state.',
  },
  {
    title: 'Submenu',
    description: 'Nest a ContextMenuSub inside the content for a hover-revealed submenu.',
  },
  {
    title: 'With shortcuts',
    description: 'ContextMenuShortcut renders a muted, right-aligned keyboard hint per item.',
  },
  {
    title: 'Disabled item',
    description: 'Disable an action with the disabled prop — keeps it visible but greyed out and unclickable.',
  },
]
