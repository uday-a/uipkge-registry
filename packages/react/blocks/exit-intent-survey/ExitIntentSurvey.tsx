'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const options = [
  'Pricing was unclear',
  'Missing an integration',
  'Just browsing',
  'Security questions',
  'Something else',
]

export function ExitIntentSurvey({ storageKey = 'uipkge:exit-survey-seen' }: { storageKey?: string }) {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState('')
  const [detail, setDetail] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onPointerOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 4) return
      try {
        if (window.sessionStorage.getItem(storageKey) === '1') return
        window.sessionStorage.setItem(storageKey, '1')
      } catch {
        // Blocked storage: shows once more this page view, never in a loop.
      }
      setOpen(true)
      document.removeEventListener('mouseout', onPointerOut)
    }
    document.addEventListener('mouseout', onPointerOut)
    return () => document.removeEventListener('mouseout', onPointerOut)
  }, [storageKey])

  function submit() {
    if (!choice) return
    setSent(true)
    // Close on its own rather than making someone dismiss a thank-you.
    setTimeout(() => setOpen(false), 1400)
  }

  return (
    <div data-slot="exit-intent-survey">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          {!sent ? (
            <div>
              <DialogHeader>
                <Badge variant="secondary" className="w-fit">
                  One question
                </Badge>
                <DialogTitle className="mt-3 text-xl leading-snug text-balance">What were you looking for?</DialogTitle>
                <DialogDescription>
                  It goes to the people who build the page. No follow-up email unless you ask for one.
                </DialogDescription>
              </DialogHeader>

              <ToggleGroup
                value={choice}
                type="single"
                variant="outline"
                size="sm"
                className="mt-5 flex-wrap justify-start"
                aria-label="Reason for leaving"
                onValueChange={(value: string) => setChoice(value ?? '')}
              >
                {options.map((option) => (
                  <ToggleGroupItem key={option} value={option}>
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <Textarea
                value={detail}
                onValueChange={setDetail}
                className="mt-3"
                rows={3}
                placeholder="Anything more (optional)"
                label="Anything more (optional)"
              />

              <div className="mt-4 flex items-center gap-2">
                <Button disabled={!choice} onClick={submit}>
                  Send
                </Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Skip
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center" aria-live="polite">
              <span className="bg-success/10 mx-auto flex size-10 items-center justify-center rounded-full">
                <Check className="text-success size-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-medium">Thanks — that is genuinely useful.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
