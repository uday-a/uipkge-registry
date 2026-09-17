import Story from '../../components/story/Story'
import { AuthSignUp } from '@react-registry-blocks/auth-sign-up/AuthSignUp'

export default function AuthSignUpDemo() {
  return (
    <Story
      title="Auth Sign Up"
      description="Full-page sign-up surface. Name/email/password/confirm form with password-match validation, T&C acceptance gate, GitHub + Google OAuth row, link back to sign-in. Emits `submit` with the validated payload and `oauth` with the chosen provider."
    >
      <AuthSignUp />
    </Story>
  )
}
