import Story from '../../components/story/Story'
import { ReferralProgramWidget } from '@react-registry-blocks/referral-program-widget/ReferralProgramWidget'

export default function ReferralProgramWidgetDemo() {
  return (
    <Story
      title="Default"
      description="Referral reward program widget with custom invite URL, quick social share actions, milestone tier stepper, and recent invitee activity."
    >
      <ReferralProgramWidget />
    </Story>
  )
}
