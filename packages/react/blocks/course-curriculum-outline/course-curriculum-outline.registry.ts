import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'course-curriculum-outline',
  type: 'registry:block',
  categories: ['education', 'app'],
  description:
    'LMS and video course syllabus block: hero header with course metadata, instructor profile, rating, progress bar, and action buttons, collapsible modular section accordions with lesson durations, type badges, and completion checks, plus a sidebar with verifiable certificate preview, downloadable course resources, and student community access.',
  files: [{ path: 'CourseCurriculumOutline.tsx', target: 'components/blocks/CourseCurriculumOutline.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
  ],
})
