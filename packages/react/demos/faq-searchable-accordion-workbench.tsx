import { FaqSearchableAccordionWorkbench } from '@/components/blocks/faq-searchable-accordion-workbench'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Searchable FAQ workbench with real-time filtering and category switcher">
      <div className="w-full">
        <FaqSearchableAccordionWorkbench />
      </div>
    </Story>
  )
}
