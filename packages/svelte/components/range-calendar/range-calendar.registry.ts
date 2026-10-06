import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'svelte',
  description:
    'Inline from→to calendar grid. Click two dates; the range fills between. Plain-Date value API with min/max, disabled-date support, fixed weeks, and configurable week start.',
  files: [
    { path: 'RangeCalendar.svelte', target: 'components/ui/range-calendar/RangeCalendar.svelte' },
    { path: 'RangeCalendarCell.svelte', target: 'components/ui/range-calendar/RangeCalendarCell.svelte' },
    { path: 'RangeCalendarCellTrigger.svelte', target: 'components/ui/range-calendar/RangeCalendarCellTrigger.svelte' },
    { path: 'RangeCalendarGrid.svelte', target: 'components/ui/range-calendar/RangeCalendarGrid.svelte' },
    { path: 'RangeCalendarGridBody.svelte', target: 'components/ui/range-calendar/RangeCalendarGridBody.svelte' },
    { path: 'RangeCalendarGridHead.svelte', target: 'components/ui/range-calendar/RangeCalendarGridHead.svelte' },
    { path: 'RangeCalendarGridRow.svelte', target: 'components/ui/range-calendar/RangeCalendarGridRow.svelte' },
    { path: 'RangeCalendarHeadCell.svelte', target: 'components/ui/range-calendar/RangeCalendarHeadCell.svelte' },
    { path: 'RangeCalendarHeader.svelte', target: 'components/ui/range-calendar/RangeCalendarHeader.svelte' },
    { path: 'RangeCalendarHeading.svelte', target: 'components/ui/range-calendar/RangeCalendarHeading.svelte' },
    {
      path: 'RangeCalendarNextButton.svelte',
      target: 'components/ui/range-calendar/RangeCalendarNextButton.svelte',
    },
    { path: 'RangeCalendarPrevButton.svelte', target: 'components/ui/range-calendar/RangeCalendarPrevButton.svelte' },
    { path: 'index.ts', target: 'components/ui/range-calendar/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
