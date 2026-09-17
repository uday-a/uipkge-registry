import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'invoices-list',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing'],
  description:
    'Invoice history page: header with a New invoice action, a three-card summary strip (total outstanding, paid this month, overdue), and an invoice table pairing monospace invoice numbers with avatar clients, issue/due dates, tabular-nums amounts, color-coded status badges, and a per-row View/Download/Mark-as-paid dropdown, closed by a pagination hint. Data is stubbed inline; swap for your source.',
  files: [{ path: 'InvoicesList.tsx', target: 'components/blocks/InvoicesList.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/table.json',
  ],
})
