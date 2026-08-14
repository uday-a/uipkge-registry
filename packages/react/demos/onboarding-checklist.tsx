import Story from '../../components/story/Story'
import { OnboardingChecklist } from '@react-registry-blocks/onboarding-checklist/OnboardingChecklist'

export default function OnboardingChecklistDemo() {
  return (
    <>
      <Story title="Default" description="Three of five tasks complete with a live progress bar and counter.">
        <OnboardingChecklist />
      </Story>

      <Story title="All done" description="Completing every task flips the body to a success panel.">
        <OnboardingChecklist initialComplete />
      </Story>
    </>
  )
}
