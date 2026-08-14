import Story from '../../components/story/Story'
import { StickyCtaCornerButton } from '@react-registry-blocks/sticky-cta-corner-button/StickyCtaCornerButton'
// StickyCtaCornerButton is the block file the user installs. Open
// `components/blocks/StickyCtaCornerButton.tsx` after install to change the
// action. It expands on focus as well as hover, for keyboard users.

export default function StickyCtaCornerButtonDemo() {
  return (
    <Story
      title="Sticky CTA — Corner Button"
      description="A compact corner action that expands on hover or focus to reveal its label, and stays clear of the content column on narrow screens."
    >
      <StickyCtaCornerButton />
    </Story>
  )
}
