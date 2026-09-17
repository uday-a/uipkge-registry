'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
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

export function ExitIntentOffer({ storageKey = 'uipkge:exit-intent-seen' }: { storageKey?: string }) {
  const [open, setOpen] = useState(false)

  const show = useCallback(() => {
    try {
      if (window.sessionStorage.getItem(storageKey) === '1') return false
      window.sessionStorage.setItem(storageKey, '1')
    } catch {
      // Blocked storage: it can show once more this page view, never in a loop.
    }
    setOpen(true)
    return true
  }, [storageKey])

  useEffect(() => {
    // Only the top edge counts. A pointer leaving left, right, or bottom is
    // usually someone reaching for a scrollbar or another window.
    const onPointerOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 4) return
      if (show()) document.removeEventListener('mouseout', onPointerOut)
    }
    document.addEventListener('mouseout', onPointerOut)
    return () => document.removeEventListener('mouseout', onPointerOut)
  }, [show])

  return (
    <div data-slot="exit-intent-offer">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Sparkles className="size-3" aria-hidden="true" />
              Before you go
            </Badge>
            <DialogTitle className="mt-3 text-xl leading-snug text-balance">Take 30 days instead of 14</DialogTitle>
            <DialogDescription className="leading-relaxed">
              A full close cycle fits in 30 days and 14 does not, which is the actual reason most trials stall. No card,
              no call, cancel from the dashboard.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <ul className="text-muted-foreground space-y-1.5 text-sm">
            <li>· Everything on the Business plan</li>
            <li>· Connect your real warehouse, read-only</li>
            <li>· Keep the definitions you author either way</li>
          </ul>

          <DialogFooter className="sm:justify-start">
            <Button>
              Start the 30-day trial
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              No thanks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
