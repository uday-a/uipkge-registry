import Story from '../../components/story/Story'
import { FeatureAccordionMedia } from '@react-registry-blocks/feature-accordion-media/FeatureAccordionMedia'
// FeatureAccordionMedia is the block file the user installs. Open
// `components/blocks/FeatureAccordionMedia.tsx` after install to swap the
// panes for screenshots. The open item drives the pane via v-model.

export default function FeatureAccordionMediaDemo() {
  return (
    <Story
      title="Features — Accordion with Media"
      description="Accordion of features beside a media pane that follows whichever item is open; below the breakpoint the panes move inline under each item."
    >
      <FeatureAccordionMedia />
    </Story>
  )
}
