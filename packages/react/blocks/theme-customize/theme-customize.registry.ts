import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'theme-customize',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'Compact theme customization popover. Light/Dark/System mode (via next-themes), six curated color presets that overwrite `--primary` / `--primary-foreground` / `--ring`, and a radius slider bound to `--radius`. Persists to localStorage and exposes a one-click Copy CSS for the active token set.',
  files: [
    { path: 'ThemeCustomize.tsx', target: 'components/blocks/ThemeCustomize.tsx' },
    { path: 'page.tsx', target: 'app/theme-customize-demo/page.tsx' },
  ],
  dependencies: ['lucide-react', 'next-themes'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
