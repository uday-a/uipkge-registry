import Story from '../../components/story/Story'
import { Login01 } from '@react-registry-blocks/login-01/Login01'
// Login01 is the block file the user installs into their project. Open
// `components/blocks/Login01.tsx` after install to wire real auth handlers
// (replace the onSubmit/onOauth/onForgotPassword no-ops).

export default function Login01Demo() {
  return (
    <Story
      title="Login 01"
      description="Centered card. Email + password, forgot-password link, primary submit, divider, then a 2-button SSO row (Google + GitHub). Sign-up footer."
    >
      <Login01 />
    </Story>
  )
}
