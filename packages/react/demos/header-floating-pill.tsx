import Story from '../../components/story/Story'
import { HeaderFloatingPill } from '@react-registry-blocks/header-floating-pill/HeaderFloatingPill'
// HeaderFloatingPill is the block file the user installs. Open
// `components/blocks/HeaderFloatingPill.tsx` after install to edit the links.
// The indicator measures the active element, so label length does not matter.

export default function HeaderFloatingPillDemo() {
  return (
    <Story
      title="Header — Floating Pill"
      description="Detached pill navbar floating above the page. A sliding indicator tracks the active link on hover and selection; the CTA stays pinned on the right."
    >
      <HeaderFloatingPill />
    </Story>
  )
}
