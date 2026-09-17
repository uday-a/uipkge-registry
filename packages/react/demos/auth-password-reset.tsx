import Story from '../../components/story/Story'
import { AuthPasswordReset } from '@react-registry-blocks/auth-password-reset/AuthPasswordReset'

export default function AuthPasswordResetDemo() {
  return (
    <Story
      title="Auth Password Reset"
      description="Four-stage flow in a single card: request (email form) -> sent (check-your-inbox confirmation with `Open reset form` demo button) -> reset (new password + confirm with match validation) -> done (success confirmation linking back to sign-in)."
    >
      <AuthPasswordReset />
    </Story>
  )
}
