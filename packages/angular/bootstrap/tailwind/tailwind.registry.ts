import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tailwind',
  type: 'registry:style',
  title: 'Tailwind v4 OKLCH tokens',
  framework: 'angular',
  description:
    'Tailwind v4 design tokens (light + dark), motion tokens, base layer styling, and shadow utilities. Byte-identical to the shared canonical token set. Copy into src/styles.css (or import it) so every component resolves its tokens.',
  files: [{ path: 'tailwind.css', target: '~/src/styles.css' }],
  // The canonical file imports tw-animate-css ( keyframes/utilities the
  // components rely on) alongside tailwindcss itself.
  dependencies: ['tw-animate-css'],
  registryDependencies: [],
})
