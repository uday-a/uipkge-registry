import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'vue',
  description:
    'Inline from→to calendar grid. Click two dates; the range fills between. For a form field with a trigger, use Date Picker type="range" instead. Same min/max and disabled-date support as Calendar.',
  files: [
    { path: 'RangeCalendar.vue', target: 'components/ui/range-calendar/RangeCalendar.vue' },
    { path: 'RangeCalendarCell.vue', target: 'components/ui/range-calendar/RangeCalendarCell.vue' },
    { path: 'RangeCalendarCellTrigger.vue', target: 'components/ui/range-calendar/RangeCalendarCellTrigger.vue' },
    { path: 'RangeCalendarGrid.vue', target: 'components/ui/range-calendar/RangeCalendarGrid.vue' },
    { path: 'RangeCalendarGridBody.vue', target: 'components/ui/range-calendar/RangeCalendarGridBody.vue' },
    { path: 'RangeCalendarGridHead.vue', target: 'components/ui/range-calendar/RangeCalendarGridHead.vue' },
    { path: 'RangeCalendarGridRow.vue', target: 'components/ui/range-calendar/RangeCalendarGridRow.vue' },
    { path: 'RangeCalendarHeadCell.vue', target: 'components/ui/range-calendar/RangeCalendarHeadCell.vue' },
    { path: 'RangeCalendarHeader.vue', target: 'components/ui/range-calendar/RangeCalendarHeader.vue' },
    { path: 'RangeCalendarHeading.vue', target: 'components/ui/range-calendar/RangeCalendarHeading.vue' },
    { path: 'RangeCalendarNextButton.vue', target: 'components/ui/range-calendar/RangeCalendarNextButton.vue' },
    { path: 'RangeCalendarPrevButton.vue', target: 'components/ui/range-calendar/RangeCalendarPrevButton.vue' },
    { path: 'index.ts', target: 'components/ui/range-calendar/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
