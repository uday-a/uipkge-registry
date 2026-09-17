import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'saved-cards-list',
  type: 'registry:block',
  categories: ['finance', 'commerce'],
  description:
    'List of stored payment cards using compact 3D card visuals. Marks one as the default, allows setting a different one as default, removing with a confirmation dialog, and adding a new card via an inline PaymentForm that collapses open. Emits `add`, `remove`, and `set-default` — consumer owns the persistence.',
  files: [{ path: 'SavedCardsList.tsx', target: 'components/blocks/SavedCardsList.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/payment-card.json',
    'https://uipkge.dev/r/payment-form.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/dialog.json',
  ],
})
