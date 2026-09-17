import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cookie-consent-preferences',
  title: 'Cookie Consent — Preferences',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Granular consent dialog listing each cookie category with its purpose, retention, and a switch, with strictly-necessary shown as locked rather than hidden.',
  framework: 'vue',
  files: [{ path: 'CookieConsentPreferences.vue', target: 'components/blocks/CookieConsentPreferences.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
  ],
})
