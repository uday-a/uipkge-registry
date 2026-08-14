import Story from '../../components/story/Story'
import { Login02 } from '@react-registry-blocks/login-02/Login02'
// Login02 is the block file the user installs into their project. Open
// `components/blocks/Login02.tsx` to swap brand copy + bullet icons in the
// left panel and wire real auth handlers on the right.

export default function Login02Demo() {
  return (
    <Story
      title="Login 02"
      description="Split layout. Brand + value-prop bullets on the left, the form on the right. Collapses to form-only on small screens."
    >
      <Login02 />
    </Story>
  )
}
