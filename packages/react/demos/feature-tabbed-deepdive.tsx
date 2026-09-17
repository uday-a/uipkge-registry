import Story from '../../components/story/Story'
import { FeatureTabbedDeepdive } from '@react-registry-blocks/feature-tabbed-deepdive/FeatureTabbedDeepdive'
// FeatureTabbedDeepdive is the block file the user installs. Open
// `components/blocks/FeatureTabbedDeepdive.tsx` after install to edit the
// `angles` array. Stating a constraint per angle is the point of the block.

export default function FeatureTabbedDeepdiveDemo() {
  return (
    <Story
      title="Features — Tabbed Deep-Dive"
      description="One feature from three angles behind tabs. Each panel carries its explanation, the constraint worth knowing, and a matching detail panel."
    >
      <FeatureTabbedDeepdive />
    </Story>
  )
}
