import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'student-gradebook-table',
  type: 'registry:block',
  categories: ['education', 'app', 'data', 'dashboard'],
  description:
    'Academic gradebook ledger with course header, weighted assignment categories (homework, midterm, labs, final project), class GPA & enrollment metric cards, overall percentage, letter grade badges, attendance tags, and student action menus.',
  files: [{ path: 'StudentGradebookTable.tsx', target: 'components/blocks/StudentGradebookTable.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/table.json',
  ],
})
