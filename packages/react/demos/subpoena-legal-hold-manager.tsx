import Story from '../../components/story/Story'
import { SubpoenaLegalHoldManager } from '@react-registry-blocks/subpoena-legal-hold-manager/SubpoenaLegalHoldManager'

export default function SubpoenaLegalHoldManagerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Enterprise e-discovery litigation hold notice tracker with 100% custodian compliance, 4 metric cards, custodian roster table, system preservation locks, and signed receipt modal."
      >
        <SubpoenaLegalHoldManager />
      </Story>

      <Story
        title="Engineering Custodians"
        description="Filtered view showing engineering and architecture custodians under active code repository and chat preservation holds."
      >
        <SubpoenaLegalHoldManager defaultFilter="engineering" />
      </Story>

      <Story
        title="Operations & Legal Custodians"
        description="Filtered view for executive and operations custodians preserving vendor contracts, cloud storage, and financial communications."
      >
        <SubpoenaLegalHoldManager defaultFilter="operations" />
      </Story>
    </>
  )
}
