import { defineRegistryItem } from '../../lib/define-registry'

const REGISTRY_URL = process.env.REGISTRY_URL ?? 'https://uipkge.dev/r'

export default defineRegistryItem({
  name: 'init',
  type: 'registry:lib',
  framework: 'angular',
  description:
    'One-shot bootstrap. Pulls tailwind tokens and the cn() helper in a single step. Copy these foundation files first when starting a new app — there is no CLI for Angular, so each file below is copied manually.',
  files: [],
  dependencies: [],
  registryDependencies: [`${REGISTRY_URL}/tailwind.json`, `${REGISTRY_URL}/utils.json`],
})
