import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'form-layouts',
  type: 'registry:block',
  categories: ['layout', 'app', 'forms'],
  description:
    'Structured create/edit entity form ("New project"): stacked SectionCards for project details (name with live slug preview, description with char counter), configuration (visibility Select, start date, budget), and access (link vs restricted RadioGroup, notification/comment Switch rows) with a sticky-feel footer bar. Create stays disabled until the name is filled; validation hints appear under empty required fields after the first submit attempt.',
  files: [{ path: 'FormLayouts.tsx', target: 'components/blocks/FormLayouts.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
