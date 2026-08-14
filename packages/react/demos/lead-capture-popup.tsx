import { useState } from 'react'
import Story from '../../components/story/Story'
import { Button } from '@react-registry/button'
import { Sparkles } from 'lucide-react'
import { LeadCapturePopup } from '@react-registry-blocks/lead-capture-popup/LeadCapturePopup'

export default function LeadCapturePopupDemo() {
  const [resetKey1, setResetKey1] = useState(0)
  const [resetKey2, setResetKey2] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Story
        title="Default Exit-Intent Popup"
        description="High-conversion lead capture container featuring live ticking urgency countdown, emerald value propositions, email form, star rating social proof, and decline link."
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <LeadCapturePopup key={resetKey1} />
          <Button variant="outline" size="sm" onClick={() => setResetKey1((k) => k + 1)}>
            Reset Popup State
          </Button>
        </div>
      </Story>

      <Story
        title="Success State & Coupon Reveal"
        description="Flipped state rendered immediately upon successful email submission, presenting the WELCOME20 coupon code with one-click clipboard copying."
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <LeadCapturePopup key={resetKey2} initialSubmitted={true} />
          <Button variant="outline" size="sm" onClick={() => setResetKey2((k) => k + 1)}>
            Reset Success State
          </Button>
        </div>
      </Story>

      <Story
        title="Modal Overlay Trigger"
        description="Simulate an exit-intent trigger where user movement towards window boundaries opens the popup in a full-screen blurred backdrop dialog."
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Button size="lg" className="gap-2 shadow-xs" onClick={() => setIsModalOpen(true)}>
            <Sparkles className="size-4" />
            Simulate Exit-Intent Trigger
          </Button>
          <p className="text-muted-foreground mt-2 text-xs">Click to open exit-intent modal overlay</p>

          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsModalOpen(false)
              }}
            >
              <div className="w-full max-w-lg">
                <LeadCapturePopup onDismiss={() => setIsModalOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </Story>

      <Story
        title="Custom 30% Flash Sale"
        description="Customized discount tier and urgency parameters for special product launches and promotional flash campaigns."
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <LeadCapturePopup
            headline="Unlock 30% Off Lifetime Pro"
            subtitle="Get instant access to 100+ components, production-grade templates, and private Discord access."
            discountCode="FLASH30"
            discountPercent={30}
            initialSeconds={300}
            socialProofRating="5.0/5"
            socialProofCount="2,800+ builders"
          />
        </div>
      </Story>
    </>
  )
}
