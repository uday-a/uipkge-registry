import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'theme-customize',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  framework: 'vue',
  description:
    'Compact theme customization popover. Light/Dark/System mode (via the useTheme cookie), six curated color presets that overwrite `--primary` / `--primary-foreground` / `--ring`, and a radius slider bound to `--radius`. Persists to localStorage and exposes a one-click Copy CSS for the active token set.',
  files: [
    { path: 'ThemeCustomize.vue', target: 'components/blocks/ThemeCustomize.vue' },
    { path: 'page.vue', target: 'app/pages/theme-customize-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
