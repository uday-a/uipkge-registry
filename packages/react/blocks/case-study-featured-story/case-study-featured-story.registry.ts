import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'case-study-featured-story',
  title: 'Case Study — Featured Story',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Single featured customer story in a split layout: narrative column with challenge/approach/result copy and a pull quote, paired with a sticky results panel of four metrics plus company facts.',
  files: [{ path: 'CaseStudyFeaturedStory.tsx', target: 'components/blocks/CaseStudyFeaturedStory.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
