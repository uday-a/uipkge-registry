import Story from '../../components/story/Story'
import { FeatureVerticalTabsPane } from '@react-registry-blocks/feature-vertical-tabs-pane/FeatureVerticalTabsPane'
// FeatureVerticalTabsPane is the block file the user installs. Open
// `components/blocks/FeatureVerticalTabsPane.tsx` after install to edit the
// `features` array; the pane sizes to the tallest panel.

export default function FeatureVerticalTabsPaneDemo() {
  return (
    <Story
      title="Features — Vertical Tabs"
      description="Vertical tabs whose triggers carry a title and summary, swapping a wide preview pane. Panels are height-matched so selecting never shifts the section."
    >
      <FeatureVerticalTabsPane />
    </Story>
  )
}
