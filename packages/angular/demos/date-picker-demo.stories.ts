import type { AngularStory } from './stories'

/** Story cards for the date-picker Angular demo (titles + descriptions mirror demos/react/date-picker.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Single-date picker bound to an optional CalendarDate value.',
  },
  {
    title: 'Multiple Dates',
    description: 'Select multiple individual dates.',
  },
  {
    title: 'Week Picker',
    description: "Select an entire week. Value is the week's start date.",
  },
  {
    title: 'Month Picker',
    description: 'Select a month.',
  },
  {
    title: 'Quarter Picker',
    description: 'Select a fiscal quarter.',
  },
  {
    title: 'Year Picker',
    description: 'Select a year.',
  },
  {
    title: 'Date Range',
    description: 'Picker for a start and end date in one popover.',
  },
  {
    title: 'Two Months',
    description: 'Display two months side by side for easier range selection.',
  },
  {
    title: 'Week Range',
    description: 'Select ranges of full weeks.',
  },
  {
    title: 'Month Range',
    description: 'Select ranges of months.',
  },
  {
    title: 'Quarter Range',
    description: 'Select ranges of quarters.',
  },
  {
    title: 'Year Range',
    description: 'Select ranges of years.',
  },
  {
    title: 'Date with Time',
    description: 'Pick both date and time.',
  },
  {
    title: 'Date-Time Range',
    description: 'Range picker with time selection.',
  },
  {
    title: '24-Hour Time',
    description: 'Time picker in 24-hour format.',
  },
  {
    title: 'Date with Seconds',
    description: 'Time picker including seconds.',
  },
  {
    title: 'Size Variants',
    description: 'Small, middle (default), and large trigger sizes.',
  },
  {
    title: 'Placement',
    description: 'Control where the popover appears relative to the trigger.',
  },
  {
    title: 'Range with Presets',
    description: 'Quick-select common date ranges with preset shortcuts.',
  },
  {
    title: 'Single with Presets',
    description: 'Preset shortcuts work for single-date mode too.',
  },
  {
    title: 'Categorized Presets',
    description: 'Presets grouped by category labels in the sidebar.',
  },
  {
    title: 'Format Options',
    description: 'Different date display formats.',
  },
  {
    title: 'Custom Intl Format',
    description: 'Use Intl.DateTimeFormatOptions for fully custom formatting.',
  },
  {
    title: 'Range Separator',
    description: 'Custom separator between start and end dates.',
  },
  {
    title: 'Min / Max Dates',
    description: 'Restrict selection to a date range.',
  },
  {
    title: 'Disabled Date',
    description: 'Disable specific dates via a function (weekends disabled here).',
  },
  {
    title: 'Disabled Time',
    description: 'Disable specific hours, minutes, or seconds.',
  },
  {
    title: 'Disabled',
    description: 'Disabled state prevents interaction.',
  },
  {
    title: 'Need Confirm',
    description: 'Selections only apply after clicking OK.',
  },
  {
    title: 'Range with Confirm',
    description: 'Range selections require confirmation.',
  },
  {
    title: 'Status States',
    description: 'Error and warning validation states.',
  },
  {
    title: 'Range Status',
    description: 'Validation states for range picker.',
  },
  {
    title: 'Custom Cell Render',
    description: 'Add badges and dots to calendar cells.',
  },
  {
    title: 'Mobile sheet pattern',
    description:
      'On small screens, compose Sheet + Calendar instead of a floating popover. Date Picker stays for desktop; this pattern is the touch-friendly alternative.',
  },
]
