'use client'

import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function CookieConsentBar({ storageKey = 'uipkge:consent' }: { storageKey?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      setVisible(!window.localStorage.getItem(storageKey))
    } catch {
      setVisible(true)
    }
  }, [storageKey])

  function decide(choice: 'accepted' | 'rejected') {
    setVisible(false)
    try {
      window.localStorage.setItem(storageKey, choice)
    } catch {
      // Blocked storage: the choice holds for this page view only.
    }
  }

  if (!visible) return null

  return (
    <div
      data-slot="cookie-consent-bar"
      className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex min-w-0 items-start gap-3">
          <Cookie className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">We store two things</p>
              <Badge variant="outline">No ad tracking</Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              A session cookie so you stay signed in, and an analytics cookie recording which pages get read. Rejecting
              keeps the first and drops the second.
            </p>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden h-10 lg:block" />

        {/* Reject carries the same visual weight as accept. A ghost "reject"
            beside a solid "accept" is a dark pattern with extra steps. */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => decide('rejected')}>
            Reject analytics
          </Button>
          <Button onClick={() => decide('accepted')}>Accept</Button>
          <Button variant="ghost" size="sm">
            Manage
          </Button>
        </div>
      </div>
    </div>
  )
}
