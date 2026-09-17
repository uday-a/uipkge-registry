import Story from '../../components/story/Story'
import { FeaturesIconListDense } from '@react-registry-blocks/features-icon-list-dense/FeaturesIconListDense'
// FeaturesIconListDense is the block file the user installs. Open
// `components/blocks/FeaturesIconListDense.tsx` after install to edit the
// `capabilities` array; the grid reflows on its own as entries are added.

export default function FeaturesIconListDenseDemo() {
  return (
    <Story
      title="Features — Dense Icon List"
      description="Twelve capabilities in a compact three-column icon list with one-line descriptions — the breadth pass that belongs below a page's detailed feature sections."
    >
      <FeaturesIconListDense />
    </Story>
  )
}
