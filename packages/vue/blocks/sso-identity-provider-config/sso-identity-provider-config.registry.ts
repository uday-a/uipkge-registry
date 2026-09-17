import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sso-identity-provider-config',
  type: 'registry:block',
  categories: ['security', 'app', 'form', 'dashboard'],
  description:
    'Enterprise Single Sign-On (SAML 2.0 / OIDC) identity provider configuration wizard with IdP preset picker, SP credentials, XML metadata dropzone, X.509 cert PEM validator, domain enforcement switch, and interactive SAML test runner.',
  framework: 'vue',
  files: [{ path: 'SsoIdentityProviderConfig.vue', target: 'components/blocks/SsoIdentityProviderConfig.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
