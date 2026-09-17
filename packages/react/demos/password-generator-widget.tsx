import Story from '../../components/story/Story'
import { PasswordGeneratorWidget } from '@react-registry-blocks/password-generator-widget/PasswordGeneratorWidget'

export default function PasswordGeneratorWidgetDemo() {
  return (
    <Story
      title="Password & Passphrase Generator"
      description="1Password and Bitwarden-style customizable secret generator with entropy strength meter, character pool toggles, memorable Diceware passphrases, PIN codes, and volatile history drawer."
    >
      <PasswordGeneratorWidget />
    </Story>
  )
}
