import Story from '../../components/story/Story'
import { OnboardingWizard } from '@react-registry-blocks/onboarding-wizard/OnboardingWizard'

export default function OnboardingWizardDemo() {
  return (
    <>
      <Story title="Default" description="Workspace step with a live URL slug preview derived from the name.">
        <OnboardingWizard />
      </Story>

      <Story title="Empty name" description="Continue is disabled until a workspace name is entered.">
        <OnboardingWizard initialWorkspaceName="" />
      </Story>

      <Story title="Team invites" description="Email input appends removable chips; skip link jumps ahead.">
        <OnboardingWizard initialStep={2} initialInvites={['amara@acme.com', 'marcus.lee@acme.com']} />
      </Story>

      <Story title="Team empty" description="No invites yet — empty state copy under the input.">
        <OnboardingWizard initialStep={2} />
      </Story>

      <Story title="Preferences" description="Three Switch rows with labels and helper descriptions.">
        <OnboardingWizard initialStep={3} />
      </Story>

      <Story title="Done" description="Success panel with a glowing check circle and invitation summary.">
        <OnboardingWizard
          initialStep={4}
          initialInvites={['amara@acme.com', 'marcus.lee@acme.com', 'priya@acme.com']}
        />
      </Story>

      <Story title="Done solo" description="Completed without invites — copy falls back to settings hint.">
        <OnboardingWizard initialStep={4} />
      </Story>

      <Story title="Compact" description="The same flow at phone-card width.">
        <div className="max-w-sm">
          <OnboardingWizard />
        </div>
      </Story>
    </>
  )
}
