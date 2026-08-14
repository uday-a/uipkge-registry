import Story from '../../components/story/Story'
import { HowItWorksTimeline } from '@react-registry-blocks/how-it-works-timeline/HowItWorksTimeline'
// HowItWorksTimeline is the block file the user installs. Open
// `components/blocks/HowItWorksTimeline.tsx` after install to edit the
// `stages` array — the rail and numbering derive from it, so adding or
// removing a stage needs no markup changes.

export default function HowItWorksTimelineDemo() {
  return (
    <Story
      title="How It Works — Vertical Timeline"
      description="Vertical implementation timeline. A continuous rail links four numbered stages; each carries a status badge, outcome bullets, and a paired detail card. Use where a three-up step row runs out of room."
    >
      <HowItWorksTimeline />
    </Story>
  )
}
