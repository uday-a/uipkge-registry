import type { AngularStory } from './stories'

/** Story cards for the radio-group Angular demo (titles mirror demos/react/radio-group.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Single-select group of mutually exclusive options.' },
  { title: 'Options prop', description: 'Render radios automatically from an options array.' },
  {
    title: 'Button style — outline',
    description: 'Button-styled radios with outline variant, matching Ant Design Radio.Button.',
  },
  { title: 'Button style — solid', description: 'Filled background when checked.' },
  { title: 'Button sizes', description: 'Small, middle (default), and large button radios.' },
  { title: 'Button group vertical', description: 'Button radios stacked vertically.' },
  { title: 'Button group with options', description: 'Button style rendered automatically from options.' },
  { title: 'Group disabled', description: 'Disabling the group disables all children automatically.' },
  { title: 'Disabled button group', description: 'Disabled state works with button-style radios too.' },
]
