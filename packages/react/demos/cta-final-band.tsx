import Story from '../../components/story/Story'
import { CtaFinalBand } from '@react-registry-blocks/cta-final-band/CtaFinalBand'
// CtaFinalBand is the block file the user installs. Open
// `components/blocks/CtaFinalBand.tsx` after install to edit the copy.

export default function CtaFinalBandDemo() {
  return (
    <Story
      title="CTA — Final Band"
      description="Closing call to action on a bordered band: primary action, a secondary path, and one line of proof for readers not ready to commit."
    >
      <CtaFinalBand />
    </Story>
  )
}
