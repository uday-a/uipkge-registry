import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pomodoro-focus-timer',
  type: 'registry:block',
  categories: ['productivity', 'dashboard', 'app'],
  description:
    'Pomodoro productivity workspace with focus and break interval timers, SVG circular progress countdown display, active task queue with pomodoro estimate badges, ambient sound generator switcher, and daily focus analytics metrics.',
  framework: 'react',
  files: [{ path: 'PomodoroFocusTimer.tsx', target: 'components/blocks/PomodoroFocusTimer.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
