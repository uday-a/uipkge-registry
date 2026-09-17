import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'recruitment-candidate-pipeline',
  type: 'registry:block',
  categories: ['hr', 'app', 'dashboard', 'ai'],
  description:
    'AI-powered applicant tracking pipeline, candidate scorecard, resume match scoring, and interview stages board.',
  framework: 'vue',
  files: [{ path: 'RecruitmentCandidatePipeline.vue', target: 'components/blocks/RecruitmentCandidatePipeline.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
