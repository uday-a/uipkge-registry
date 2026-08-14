import Story from '../../components/story/Story'
import { AuthMfa } from '@react-registry-blocks/auth-mfa/AuthMfa'

export default function AuthMfaDemo() {
  return (
    <Story
      title="Auth MFA"
      description="Two-step verification card. 6-digit OTP pin input auto-submits on entry, shows verifying state and an inline error on mismatch, has a 30-second resend cooldown, and swaps to a Verified card with a Continue button on success. Try code `123456` in the demo."
    >
      <AuthMfa />
    </Story>
  )
}
