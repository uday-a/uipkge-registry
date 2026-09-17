import Story from '../../components/story/Story'
import { FeatureAlternatingRows } from '@react-registry-blocks/feature-alternating-rows/FeatureAlternatingRows'
// FeatureAlternatingRows is the block file the user installs. Open
// `components/blocks/FeatureAlternatingRows.tsx` after install to edit the
// `rows` array — `reverse` flips a row, so the alternation stays automatic.

export default function FeatureAlternatingRowsDemo() {
  return (
    <Story
      title="Feature Deep-Dive — Alternating Rows"
      description="Zig-zag feature deep-dive. Three rows alternate copy and visual; each pairs an eyebrow, headline, benefit checklist, and inline link with a bordered preview panel."
    >
      <FeatureAlternatingRows />
    </Story>
  )
}
