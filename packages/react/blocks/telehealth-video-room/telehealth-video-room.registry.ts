import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'telehealth-video-room',
  type: 'registry:block',
  categories: ['healthcare', 'app', 'communication'],
  description:
    'HIPAA-compliant telehealth video consultation room with live telemetry vitals, clinical SOAP notes, in-call encrypted chat, and prescription generator drawer.',
  files: [{ path: 'TelehealthVideoRoom.tsx', target: 'components/blocks/TelehealthVideoRoom.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
