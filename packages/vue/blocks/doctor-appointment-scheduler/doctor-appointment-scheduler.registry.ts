import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'doctor-appointment-scheduler',
  type: 'registry:block',
  categories: ['healthcare', 'app', 'clinical', 'forms'],
  description:
    'Zocdoc and Epic style specialist doctor appointment booking scheduler: physician profile hero card with rating, clinic address, and insurance badges, interactive visit type selector, reason for visit dropdown, date carousel with daily availability indicators, morning and afternoon time slot picker, live appointment summary readout with copay estimate, patient registration inputs, and booking confirmation flow.',
  framework: 'vue',
  files: [{ path: 'DoctorAppointmentScheduler.vue', target: 'components/blocks/DoctorAppointmentScheduler.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
