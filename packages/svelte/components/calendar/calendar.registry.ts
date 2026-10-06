import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'svelte',
  description:
    'Single-month calendar grid for date selection (hand-rolled runes state + @internationalized/date). Use inline or in a custom popover. For form fields, use Date Picker. Supports min/max, disabled dates, multi-month, and locale.',
  files: [
    { path: 'Calendar.svelte', target: 'components/ui/calendar/Calendar.svelte' },
    { path: 'CalendarCell.svelte', target: 'components/ui/calendar/CalendarCell.svelte' },
    { path: 'CalendarCellTrigger.svelte', target: 'components/ui/calendar/CalendarCellTrigger.svelte' },
    { path: 'CalendarGrid.svelte', target: 'components/ui/calendar/CalendarGrid.svelte' },
    { path: 'CalendarGridBody.svelte', target: 'components/ui/calendar/CalendarGridBody.svelte' },
    { path: 'CalendarGridHead.svelte', target: 'components/ui/calendar/CalendarGridHead.svelte' },
    { path: 'CalendarGridRow.svelte', target: 'components/ui/calendar/CalendarGridRow.svelte' },
    { path: 'CalendarHeadCell.svelte', target: 'components/ui/calendar/CalendarHeadCell.svelte' },
    { path: 'CalendarHeader.svelte', target: 'components/ui/calendar/CalendarHeader.svelte' },
    { path: 'CalendarHeading.svelte', target: 'components/ui/calendar/CalendarHeading.svelte' },
    { path: 'CalendarNextButton.svelte', target: 'components/ui/calendar/CalendarNextButton.svelte' },
    { path: 'CalendarPrevButton.svelte', target: 'components/ui/calendar/CalendarPrevButton.svelte' },
    { path: 'NativeSelect.svelte', target: 'components/ui/calendar/NativeSelect.svelte' },
    { path: 'NativeSelectOption.svelte', target: 'components/ui/calendar/NativeSelectOption.svelte' },
    { path: 'calendar-state.svelte.ts', target: 'components/ui/calendar/calendar-state.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/calendar/index.ts' },
  ],
  dependencies: ['@internationalized/date', '@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
