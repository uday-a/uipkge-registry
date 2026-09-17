import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'auth-password-reset',
  type: 'registry:block',
  categories: ['auth'],
  description:
    'Four-stage password reset surface in a single card: request (email form) -> sent (check-your-inbox confirmation with "Open reset form" demo button) -> reset (new password + confirm with match validation) -> done (success confirmation linking back to sign-in). Emits `request` (email) when the link is asked for and `reset` (password) when the new password is set; consumer wires the actual mail/db calls.',
  framework: 'vue',
  files: [{ path: 'AuthPasswordReset.vue', target: 'components/blocks/AuthPasswordReset.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/button.json',
  ],
})
