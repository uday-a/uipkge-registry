import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'vue',
  description:
    'Single-month calendar grid for date selection (reka-ui + @internationalized/date). Use inline or in a custom popover. For form fields, use Date Picker. Supports min/max, disabled dates, multi-month, and locale.',
  files: [
    { path: 'Calendar.vue', target: 'components/ui/calendar/Calendar.vue' },
    { path: 'CalendarCell.vue', target: 'components/ui/calendar/CalendarCell.vue' },
    { path: 'CalendarCellTrigger.vue', target: 'components/ui/calendar/CalendarCellTrigger.vue' },
    { path: 'CalendarGrid.vue', target: 'components/ui/calendar/CalendarGrid.vue' },
    { path: 'CalendarGridBody.vue', target: 'components/ui/calendar/CalendarGridBody.vue' },
    { path: 'CalendarGridHead.vue', target: 'components/ui/calendar/CalendarGridHead.vue' },
    { path: 'CalendarGridRow.vue', target: 'components/ui/calendar/CalendarGridRow.vue' },
    { path: 'CalendarHeadCell.vue', target: 'components/ui/calendar/CalendarHeadCell.vue' },
    { path: 'CalendarHeader.vue', target: 'components/ui/calendar/CalendarHeader.vue' },
    { path: 'CalendarHeading.vue', target: 'components/ui/calendar/CalendarHeading.vue' },
    { path: 'CalendarNextButton.vue', target: 'components/ui/calendar/CalendarNextButton.vue' },
    { path: 'CalendarPrevButton.vue', target: 'components/ui/calendar/CalendarPrevButton.vue' },
    { path: 'NativeSelect.vue', target: 'components/ui/calendar/NativeSelect.vue' },
    { path: 'NativeSelectOption.vue', target: 'components/ui/calendar/NativeSelectOption.vue' },
    { path: 'index.ts', target: 'components/ui/calendar/index.ts' },
  ],
  dependencies: ['@internationalized/date', '@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
