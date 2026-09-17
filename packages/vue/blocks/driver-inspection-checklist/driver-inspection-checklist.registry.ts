import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'driver-inspection-checklist',
  type: 'registry:block',
  categories: ['logistics', 'app', 'forms'],
  description:
    'Commercial vehicle Driver Vehicle Inspection Report (DVIR) pre-trip and post-trip safety audit. Features vehicle odometer & ELD telemetry header, 5 grouped FMCSA safety inspection categories (Brakes & Air Pressure, Tires & Wheels, Lights & Electrical, Engine & Fluids, Emergency Safety Gear) with Pass/Fail/N/A segmented controls, dynamic defect report card with Out-of-Service severity classification, defect notes, photo dropzone, driver CDL certification signature pad, and post-submission compliance receipt.',
  framework: 'vue',
  files: [{ path: 'DriverInspectionChecklist.vue', target: 'components/blocks/DriverInspectionChecklist.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
