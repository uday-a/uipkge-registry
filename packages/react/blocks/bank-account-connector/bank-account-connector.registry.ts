import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bank-account-connector',
  type: 'registry:block',
  categories: ['finance', 'dashboard'],
  description:
    'Plaid/Tink style bank linking modal and account selector with institution search, popular bank grid (Chase, Bank of America, Wells Fargo, Citibank, Capital One, SVB), account radio selection with balances and badges, and an AES-256 encrypted security footer.',
  files: [{ path: 'BankAccountConnector.tsx', target: 'components/blocks/BankAccountConnector.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
