import Story from '../../components/story/Story'
import { PrivacyPolicyGenerator } from '@react-registry-blocks/privacy-policy-generator/PrivacyPolicyGenerator'

export default function PrivacyPolicyGeneratorDemo() {
  return (
    <Story
      title="Default"
      description="Customizable website privacy policy builder with third-party tracking disclosures, CCPA, and GDPR compliance clauses."
    >
      <PrivacyPolicyGenerator />
    </Story>
  )
}
