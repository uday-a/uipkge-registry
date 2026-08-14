import Story from '../../components/story/Story'
import { ThemeCustomize } from '@react-registry-blocks/theme-customize/ThemeCustomize'

export default function ThemeCustomizeDemo() {
  return (
    <Story
      title="Default"
      description="A theme customizer in a slide-out sheet. Curated theme presets, mode/color/surface/font/radius controls, a live preview, and Copy CSS / Export actions. Open with ⌘J."
    >
      <ThemeCustomize />
    </Story>
  )
}
