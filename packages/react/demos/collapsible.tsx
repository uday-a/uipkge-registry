import { useState } from 'react'
import Story from '../../components/story/Story'
import { Button } from '@react-registry/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@react-registry/collapsible'
import { ChevronsUpDown, Minus, Plus } from 'lucide-react'

export default function CollapsibleDemo() {
  const [open, setOpen] = useState(true)
  const [buttonOpen, setButtonOpen] = useState(false)
  const [chevronOpen, setChevronOpen] = useState(false)

  return (
    <>
      <Story title="Controlled" description="Two-way bound open state with the current value rendered alongside.">
        <div className="space-y-3">
          <Collapsible open={open} onOpenChange={setOpen} className="max-w-md">
            <div className="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
              <h4 className="text-sm font-medium">@uipkge starred 3 repositories</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <ChevronsUpDown className="size-4" aria-hidden="true" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <div className="mt-1 rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
            <CollapsibleContent className="mt-1 space-y-1">
              <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
              <div className="rounded-md border px-4 py-2 font-mono text-sm">@vueuse/core</div>
            </CollapsibleContent>
          </Collapsible>
          <p className="text-muted-foreground text-xs">
            Open: <code className="text-foreground">{String(open)}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Uncontrolled"
        description="defaultOpen sets the initial state — the component manages it internally."
      >
        <Collapsible defaultOpen className="max-w-md">
          <div className="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
            <h4 className="text-sm font-medium">Today's reminders</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <ChevronsUpDown className="size-4" aria-hidden="true" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-1 space-y-1">
            <div className="rounded-md border px-4 py-2 text-sm">Stand-up at 10:00</div>
            <div className="rounded-md border px-4 py-2 text-sm">Design review at 14:30</div>
            <div className="rounded-md border px-4 py-2 text-sm">Submit timesheet</div>
          </CollapsibleContent>
        </Collapsible>
      </Story>

      <Story title="Button trigger" description="Using asChild lets the trigger forward props onto a custom Button.">
        <Collapsible open={buttonOpen} onOpenChange={setButtonOpen} className="max-w-md">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {buttonOpen ? (
                <Minus className="size-4" aria-hidden="true" />
              ) : (
                <Plus className="size-4" aria-hidden="true" />
              )}
              {buttonOpen ? 'Hide details' : 'Show details'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-md border px-4 py-3 text-sm">
            <p className="font-medium">Order #18412</p>
            <p className="text-muted-foreground mt-1">Shipped via UPS Ground · Estimated delivery May 12.</p>
          </CollapsibleContent>
        </Collapsible>
      </Story>

      <Story title="Long content" description="Wraps a larger block of nested rows that toggle as one unit.">
        <Collapsible defaultOpen className="max-w-md">
          <div className="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
            <h4 className="text-sm font-medium">Recent commits (12)</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <ChevronsUpDown className="size-4" aria-hidden="true" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-1 space-y-1">
            {Array.from({ length: 8 }).map((_, idx) => {
              const i = idx + 1
              return (
                <div key={i} className="rounded-md border px-4 py-2 font-mono text-xs">
                  <span className="text-muted-foreground">
                    {'0a1b2c'.slice(0, 6)}
                    {i}
                  </span>
                  <span className="ml-2">
                    refactor: extract use
                    {['Auth', 'Theme', 'Toast', 'Form', 'Query', 'Cache', 'Sidebar', 'Modal'][i - 1]} composable
                  </span>
                </div>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      </Story>

      <Story
        title="Animated chevron rotation"
        description="The default slot exposes the open state, so the trigger icon can rotate as the content reveals. Pure CSS transition on a single class."
      >
        <Collapsible open={chevronOpen} onOpenChange={setChevronOpen} className="max-w-md">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="font-medium">Advanced options</span>
              <ChevronsUpDown
                className={['size-4 transition-transform duration-200', chevronOpen && 'rotate-180']
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1.5">
            <div className="rounded-md border px-4 py-2 text-sm">
              <span className="text-muted-foreground">Webhook URL</span>
              <code className="text-foreground/90 ml-2 font-mono text-xs">https://api.example.com/hooks</code>
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              <span className="text-muted-foreground">Retry policy</span>
              <span className="ml-2">Exponential backoff, max 5</span>
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              <span className="text-muted-foreground">Timeout</span>
              <span className="ml-2">30s</span>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Story>
    </>
  )
}
