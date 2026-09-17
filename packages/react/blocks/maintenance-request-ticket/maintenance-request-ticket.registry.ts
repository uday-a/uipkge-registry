import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'maintenance-request-ticket',
  type: 'registry:block',
  categories: ['real-estate', 'hospitality', 'app', 'forms'],
  description: 'Resident repair and facility work order submission portal with urgency priority and photo dropzone.',
  files: [{ path: 'MaintenanceRequestTicket.tsx', target: 'components/blocks/MaintenanceRequestTicket.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
