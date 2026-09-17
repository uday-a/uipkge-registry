import Story from '../../components/story/Story'
import { InsuranceEligibilityChecker } from '@react-registry-blocks/insurance-eligibility-checker/InsuranceEligibilityChecker'

export default function InsuranceEligibilityCheckerDemo() {
  return (
    <Story
      title="Default"
      description="Real-time health insurance eligibility & benefits verifier with patient demographics, copay cards, accumulator progress bars, category breakdown table, and Medicare secondary coordination."
    >
      <InsuranceEligibilityChecker />
    </Story>
  )
}
