import Story from '../../components/story/Story'
import { FaqContactSidebar } from '@react-registry-blocks/faq-contact-sidebar/FaqContactSidebar'
// FaqContactSidebar is the block file the user installs. Open
// `components/blocks/FaqContactSidebar.tsx` after install to point the card
// at a real inbox. The sidebar is `lg:sticky` so it stays beside long lists.

export default function FaqContactSidebarDemo() {
  return (
    <Story
      title="FAQ — With Contact Sidebar"
      description="Answers beside a sticky support card with a named contact, a stated response time, and a docs link — for whatever the list does not cover."
    >
      <FaqContactSidebar />
    </Story>
  )
}
