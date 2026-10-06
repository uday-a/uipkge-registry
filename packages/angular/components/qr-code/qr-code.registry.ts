import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'qr-code',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'QR code renderer — pass `value` and a size, get a canvas PNG or SVG. Useful for sign-in links, share URLs, and Wi-Fi credentials. Depends on the `qrcode` package.',
  files: [
    { path: 'qr-code.component.ts', target: 'components/ui/qr-code/qr-code.component.ts' },
    { path: 'index.ts', target: 'components/ui/qr-code/index.ts' },
  ],
  dependencies: ['qrcode'],
  devDependencies: ['@types/qrcode'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
