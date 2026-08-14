export { default as Icon } from './Icon.vue'

// Icon library class prefixes for reference:
// Font Awesome: 'fa-solid', 'fa-regular', 'fa-brands', 'fa-*'
// Material Design: 'mdi mdi-*'
// Heroicons: already SVG-based, use slot

// Helper function to generate Font Awesome class
export function faClass(iconName: string, style: 'solid' | 'regular' | 'brands' = 'solid'): string {
  const prefix = style === 'brands' ? 'fab' : style === 'solid' ? 'fas' : 'far'
  return `${prefix} fa-${iconName}`
}

// Helper function to generate Material Design class
export function mdiClass(iconName: string): string {
  return `mdi mdi-${iconName}`
}
