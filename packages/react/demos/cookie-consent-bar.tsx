import Story from '../../components/story/Story'
import { CookieConsentBar } from '@react-registry-blocks/cookie-consent-bar/CookieConsentBar'
// CookieConsentBar is the block file the user installs. Open
// `components/blocks/CookieConsentBar.tsx` after install to wire the
// handlers. Reject is styled the same as accept, deliberately.

export default function CookieConsentBarDemo() {
  return (
    <Story
      title="Cookie Consent — Bar"
      description="Bottom consent bar with accept, reject, and manage weighted equally, plus a one-line statement of what is actually stored."
    >
      <CookieConsentBar />
    </Story>
  )
}
