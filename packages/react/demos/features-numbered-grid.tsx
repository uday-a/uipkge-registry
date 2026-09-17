import Story from '../../components/story/Story'
import { FeaturesNumberedGrid } from '@react-registry-blocks/features-numbered-grid/FeaturesNumberedGrid'
// FeaturesNumberedGrid is the block file the user installs. Open
// `components/blocks/FeaturesNumberedGrid.tsx` after install to edit the
// `features` array — ordinals are derived from index, so order is the source.

export default function FeaturesNumberedGridDemo() {
  return (
    <Story
      title="Features — Numbered Grid"
      description="Six-cell grid drawn with hairline dividers rather than cards. Each cell leads with a monospace ordinal, then icon, title, and two lines of copy."
    >
      <FeaturesNumberedGrid />
    </Story>
  )
}
