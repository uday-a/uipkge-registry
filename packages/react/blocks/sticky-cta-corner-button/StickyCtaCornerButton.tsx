'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function StickyCtaCornerButton() {
  // Expands on focus as well as hover: a keyboard user should be able to read
  // the label before deciding whether to activate it.
  const [expanded, setExpanded] = useState(false)

  return (
    <div data-slot="sticky-cta-corner-button" className="fixed right-5 bottom-5 z-50">
      <Button
        size="lg"
        className="group h-12 gap-0 rounded-full pr-4 pl-4 shadow-lg transition-all"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
      >
        <MessageSquare className="size-5 shrink-0" aria-hidden="true" />
        {/* Width, not display: a hidden label would not animate, and a label that
            pops in shifts the button under the cursor mid-click. */}
        <span
          className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
            expanded ? 'ml-2 max-w-[10rem] opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          Ask an engineer
        </span>
      </Button>

      <Badge
        variant="secondary"
        className="border-background pointer-events-none absolute -top-1 -right-1 size-5 justify-center rounded-full border-2 p-0 text-[10px]"
      >
        1
      </Badge>
    </div>
  )
}
