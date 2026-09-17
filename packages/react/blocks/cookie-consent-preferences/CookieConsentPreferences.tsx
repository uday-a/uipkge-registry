'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

const categories = [
  {
    id: 'necessary',
    label: 'Strictly necessary',
    purpose: 'Session and sign-in state. Without these the app cannot keep you logged in.',
    retention: 'Session',
    locked: true,
  },
  {
    id: 'analytics',
    label: 'Product analytics',
    purpose: 'Which pages are read and where people give up. Aggregated, never sold.',
    retention: '13 months',
    locked: false,
  },
  {
    id: 'support',
    label: 'Support chat',
    purpose: 'Keeps a conversation open across page loads so you do not repeat yourself.',
    retention: '30 days',
    locked: false,
  },
]

export function CookieConsentPreferences() {
  const [open, setOpen] = useState(true)
  const [choices, setChoices] = useState<Record<string, boolean>>({
    necessary: true,
    analytics: false,
    support: false,
  })

  return (
    <div data-slot="cookie-consent-preferences">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit">
              Privacy
            </Badge>
            <DialogTitle className="mt-3 text-xl">Choose what we store</DialogTitle>
            <DialogDescription>
              Each category says what it is for and how long it is kept. Nothing here is advertising.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category.id} className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{category.label}</p>
                    {category.locked && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="size-2.5" aria-hidden="true" />
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{category.purpose}</p>
                  <p className="text-muted-foreground/80 mt-1 font-mono text-xs">Kept {category.retention}</p>
                </div>
                <Switch
                  checked={choices[category.id]}
                  onCheckedChange={(value: boolean) => setChoices((c) => ({ ...c, [category.id]: value }))}
                  disabled={category.locked}
                  aria-label={`Allow ${category.label}`}
                  className="mt-1 shrink-0"
                />
              </li>
            ))}
          </ul>

          <DialogFooter className="sm:justify-start">
            <Button onClick={() => setOpen(false)}>Save choices</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Reject optional
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
