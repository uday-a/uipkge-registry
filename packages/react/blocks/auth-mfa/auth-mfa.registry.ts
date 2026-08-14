import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'auth-mfa',
  type: 'registry:block',
  categories: ['auth'],
  description:
    'Two-step verification surface. 6-digit OTP pin input auto-submits on entry, shows verifying state and an inline error on mismatch, has a 30-second resend cooldown, and swaps to a Verified card with a Continue button on success. Emits `verify` (code), `resend`, and `continue`. `demoCode` prop controls the value the built-in mock validator accepts.',
  files: [{ path: 'AuthMfa.tsx', target: 'components/blocks/AuthMfa.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/pin-input.json',
  ],
})
