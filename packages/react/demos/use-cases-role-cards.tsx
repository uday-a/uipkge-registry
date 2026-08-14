import Story from '../../components/story/Story'
import { UseCasesRoleCards } from '@react-registry-blocks/use-cases-role-cards/UseCasesRoleCards'
// UseCasesRoleCards is the block file the user installs. Open
// `components/blocks/UseCasesRoleCards.tsx` after install to edit the
// `roles` array.

export default function UseCasesRoleCardsDemo() {
  return (
    <Story
      title="Use Cases — Role Cards"
      description="Role cards stating the job to be done, the first week of work, and the metric that role is measured on — self-selection without a tab interaction."
    >
      <UseCasesRoleCards />
    </Story>
  )
}
