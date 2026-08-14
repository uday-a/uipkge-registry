import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dns-record-manager',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'data'],
  description:
    'Cloudflare/Vercel style DNS records management table and nameserver inspector with type badges, proxy toggle, copyable values, zone file exporter, and add/edit record panel.',
  files: [{ path: 'DnsRecordManager.tsx', target: 'components/blocks/DnsRecordManager.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
