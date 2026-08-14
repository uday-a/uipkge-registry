import Story from '../../components/story/Story'
import { CookieConsentPreferences } from '@react-registry-blocks/cookie-consent-preferences/CookieConsentPreferences'
// CookieConsentPreferences is the block file the user installs. Open
// `components/blocks/CookieConsentPreferences.tsx` after install to edit the
// categories and persist the result.

export default function CookieConsentPreferencesDemo() {
  return (
    <Story
      title="Cookie Consent — Preferences"
      description="Granular consent: each category with its purpose, retention, and a switch — strictly-necessary shown locked rather than hidden from the list."
    >
      <CookieConsentPreferences />
    </Story>
  )
}
