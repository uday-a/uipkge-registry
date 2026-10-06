import type { AngularStory } from './stories'

/** Story cards for the time-picker Angular demo (titles + descriptions mirror demos/react/time-picker.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: '24-hour time input bound to a string in HH:mm format.',
  },
  {
    title: 'With Seconds',
    description: 'HH:mm:ss format includes a seconds column.',
  },
  {
    title: '12-Hour Format',
    description: 'hh:mm A displays AM/PM and uses 12-hour columns.',
  },
  {
    title: 'use12Hours',
    description: 'Explicit 12-hour mode with AM/PM selector.',
  },
  {
    title: 'Disabled Time',
    description: 'Programmatically disable specific hours, minutes, and seconds.',
  },
  {
    title: 'Hide Disabled Options',
    description: 'Disabled values are completely hidden from the columns rather than greyed out.',
  },
  {
    title: 'Steps',
    description: 'Skip values with hour, minute, and second steps.',
  },
  {
    title: 'Presets',
    description: 'Quick-select common times from a preset list.',
  },
  {
    title: 'Range Picker',
    description: 'Select a start and end time side by side.',
  },
  {
    title: 'Sizes',
    description: 'Small, middle (default), and large trigger heights.',
  },
  {
    title: 'Status',
    description: 'Error and warning validation states.',
  },
  {
    title: 'Allow Clear',
    description: 'Click the X to clear the selected time.',
  },
  {
    title: 'Suffix Icon',
    description: 'Clock icon is shown by default in the trigger.',
  },
  {
    title: 'Full Featured',
    description: 'Seconds + 12-hour + steps + disabled time + presets all together.',
  },
]
