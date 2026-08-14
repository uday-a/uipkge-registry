import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'assignment-submission-dropzone',
  type: 'registry:block',
  categories: ['education', 'app', 'forms', 'dashboard'],
  description:
    'University coursework submission portal with plagiarism check indicator, grading rubric, and deadline timer.',
  framework: 'vue',
  files: [
    {
      path: 'AssignmentSubmissionDropzone.vue',
      target: 'components/blocks/AssignmentSubmissionDropzone.vue',
    },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
