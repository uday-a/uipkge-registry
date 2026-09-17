import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CookieConsentBanner } from '@react-registry-blocks/cookie-consent-banner/CookieConsentBanner'
import Story from '../../components/story/Story'

export default function CookieConsentBannerDemo() {
  const [barKey, setBarKey] = useState(0)
  const [cardKey, setCardKey] = useState(0)

  return (
    <>
      <Story
        title="Bottom bar"
        description="Full-width consent bar with cookie icon, Cookie Policy link, and Customize / Reject / Accept all actions. Customize expands inline preferences. Dismiss it, then reset to bring it back."
      >
        <div className="flex flex-col items-center gap-3">
          <div className="border-border w-full overflow-hidden rounded-lg border">
            <CookieConsentBanner key={barKey} variant="bottom-bar" />
          </div>
          <Button variant="outline" size="sm" onClick={() => setBarKey((k) => k + 1)}>
            Reset banner
          </Button>
        </div>
      </Story>

      <Story
        title="Card"
        description="Compact rounded card with the same content stacked vertically. Flip the theme toggle to check tokens in dark mode."
      >
        <div className="flex flex-col items-center gap-3">
          <CookieConsentBanner key={cardKey} variant="card" />
          <Button variant="outline" size="sm" onClick={() => setCardKey((k) => k + 1)}>
            Reset banner
          </Button>
        </div>
      </Story>
    </>
  )
}
