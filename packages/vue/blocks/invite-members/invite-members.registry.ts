import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'invite-members',
  type: 'registry:block',
  categories: ['security', 'dashboard', 'communication'],
  description:
    'Team invite surface in a SectionCard. Header carries a live seats counter tinting warning at ≥90% capacity. ' +
    'Compose takes one email or a comma/space-separated paste — several addresses queue as removable chips first, ' +
    'plus an Admin/Editor/Viewer role Select and basic validation with a destructive error state. Rows show avatar ' +
    'initials, email, role/status badges (pending/accepted/expired), sent-ago timestamps, Resend (re-activates ' +
    'expired invites) and Revoke behind a two-click inline confirm. Self-contained stateful demo — swap ' +
    'DEFAULT_INVITES for your data source.',
  framework: 'vue',
  files: [{ path: 'InviteMembers.vue', target: 'components/blocks/InviteMembers.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/section-card.json',
  ],
})
