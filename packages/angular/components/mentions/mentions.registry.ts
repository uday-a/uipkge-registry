import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'mentions',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Textarea with trigger-character autocomplete and companion MentionTag with Twitter/X-style hover profile card popup.',
  files: [
    { path: 'mentions.component.ts', target: 'components/ui/mentions/mentions.component.ts' },
    { path: 'mention-tag.component.ts', target: 'components/ui/mentions/mention-tag.component.ts' },
    { path: 'caret-position.ts', target: 'components/ui/mentions/caret-position.ts' },
    { path: 'index.ts', target: 'components/ui/mentions/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/hover-card.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/popper.json',
  ],
})
