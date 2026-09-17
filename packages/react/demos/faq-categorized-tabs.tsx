import Story from '../../components/story/Story'
import { FaqCategorizedTabs } from '@react-registry-blocks/faq-categorized-tabs/FaqCategorizedTabs'
// FaqCategorizedTabs is the block file the user installs. Open
// `components/blocks/FaqCategorizedTabs.tsx` after install to edit the
// `categories` array; counts derive from the entries in each.

export default function FaqCategorizedTabsDemo() {
  return (
    <Story
      title="FAQ — Categorized Tabs"
      description="Questions grouped behind category tabs, each panel an accordion with its own count. For sets too long to read as one flat list."
    >
      <FaqCategorizedTabs />
    </Story>
  )
}
