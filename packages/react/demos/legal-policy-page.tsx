import Story from '../../components/story/Story'
import { LegalPolicyPage } from '@react-registry-blocks/legal-policy-page/LegalPolicyPage'

export default function LegalPolicyPageDemo() {
  return (
    <Story
      title="Default"
      description="Privacy Policy and legal documentation layout with top metadata header, version switcher, sticky table of contents navigation, and structured compliance sections."
    >
      <LegalPolicyPage />
    </Story>
  )
}
