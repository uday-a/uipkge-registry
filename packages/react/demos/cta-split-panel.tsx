import Story from '../../components/story/Story'
import { CtaSplitPanel } from '@react-registry-blocks/cta-split-panel/CtaSplitPanel'
// CtaSplitPanel is the block file the user installs. Open
// `components/blocks/CtaSplitPanel.tsx` after install to edit both paths.

export default function CtaSplitPanelDemo() {
  return (
    <Story
      title="CTA — Split Panel"
      description="Two closing paths — self-serve and sales-assisted — each stating who it suits and what happens next, so choosing is not a guess."
    >
      <CtaSplitPanel />
    </Story>
  )
}
