import Story from '../../components/story/Story'
import { AuthSignIn } from '@react-registry-blocks/auth-sign-in/AuthSignIn'

export default function AuthSignInDemo() {
  return (
    <Story
      title="Auth Sign In"
      description="Full-page sign-in surface. Email + password + remember-me form, forgot-password and sign-up links, GitHub + Google OAuth row. Emits `submit` with the form payload and `oauth` with the chosen provider."
    >
      <AuthSignIn />
    </Story>
  )
}
