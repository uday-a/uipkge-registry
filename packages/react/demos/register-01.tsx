import Story from '../../components/story/Story'
import { Register01 } from '@react-registry-blocks/register-01/Register01'

export default function Register01Demo() {
  return (
    <Story
      title="Register 01"
      description="Centered sign-up card. Name, email, password, confirm with mismatch warning, terms-checkbox-gated submit, divider, SSO row, sign-in footer."
    >
      <Register01 />
    </Story>
  )
}
