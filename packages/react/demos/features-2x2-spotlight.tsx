import Story from '../../components/story/Story'
import { Features2x2Spotlight } from '@react-registry-blocks/features-2x2-spotlight/Features2x2Spotlight'
// Features2x2Spotlight is the block file the user installs. Open
// `components/blocks/Features2x2Spotlight.tsx` after install to swap the
// illustration slots for real screenshots — the panels size to their content.

export default function Features2x2SpotlightDemo() {
  return (
    <Story
      title="Features — 2×2 Spotlight"
      description="Four large panels in a 2×2 grid. Each pairs a primitive-built illustration slot with a headline, supporting copy, and a quiet inline link."
    >
      <Features2x2Spotlight />
    </Story>
  )
}
