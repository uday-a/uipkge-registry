import Story from '../../components/story/Story'
import { UseCasesPersonaTabs } from '@react-registry-blocks/use-cases-persona-tabs/UseCasesPersonaTabs'
// UseCasesPersonaTabs is the block file the user installs. Open
// `components/blocks/UseCasesPersonaTabs.tsx` after install to edit the
// `personas` array. Panels are height-matched so switching tabs does not
// jump the page.

export default function UseCasesPersonaTabsDemo() {
  return (
    <Story
      title="Use Cases — Persona Tabs"
      description="Persona-switched use cases. Selecting a role swaps the pain-point summary, outcome list, supporting metric, and CTA in place — no navigation, no layout shift between tabs."
    >
      <UseCasesPersonaTabs />
    </Story>
  )
}
