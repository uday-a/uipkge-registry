import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'meeting-agenda-notes',
  type: 'registry:block',
  categories: ['productivity', 'app', 'collaboration'],
  description:
    'Linear and Notion style structured meeting document with attendee avatars, timeboxed agenda topics, rich discussion notes, interactive action items checklist, and key decisions log.',
  framework: 'vue',
  files: [{ path: 'MeetingAgendaNotes.vue', target: 'components/blocks/MeetingAgendaNotes.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
