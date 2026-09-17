import Story from '../../components/story/Story'
import { FeatureFullBleedRows } from '@react-registry-blocks/feature-full-bleed-rows/FeatureFullBleedRows'
// FeatureFullBleedRows is the block file the user installs. Open
// `components/blocks/FeatureFullBleedRows.tsx` after install to edit the
// `rows` array; `reverse` flips a band and the surface alternates with it.

export default function FeatureFullBleedRowsDemo() {
  return (
    <Story
      title="Features — Full-Bleed Rows"
      description="Alternating full-bleed bands on contrasting surfaces, each pairing headline and detail with a visual that runs past the container edge."
    >
      <FeatureFullBleedRows />
    </Story>
  )
}
