import Story from '../../components/story/Story'
import { Avatar, AvatarFallback, AvatarImage } from '@react-registry/avatar'
import { Button } from '@react-registry/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@react-registry/hover-card'
import { CalendarDays } from 'lucide-react'

export default function HoverCardDemo() {
  return (
    <>
      <Story title="Default" description="Hover the trigger to reveal a card with avatar and details.">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@uipkge</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-semibold">@uipkge</p>
                <p className="text-muted-foreground text-xs">Open-source UI registry. shadcn-vue compatible.</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Story>

      <Story
        title="Custom delays"
        description="openDelay / closeDelay (ms) tune how quickly the card appears and dismisses."
      >
        <div className="flex flex-wrap items-center gap-4">
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild>
              <Button variant="outline">Instant</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-56">
              <p className="text-sm">openDelay: 0 — appears immediately on hover.</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={700} closeDelay={200}>
            <HoverCardTrigger asChild>
              <Button variant="outline">Default-ish</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-56">
              <p className="text-sm">openDelay: 700 / closeDelay: 200 — feels intentional.</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={1500} closeDelay={500}>
            <HoverCardTrigger asChild>
              <Button variant="outline">Lazy</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-56">
              <p className="text-sm">openDelay: 1500 / closeDelay: 500 — slow to surface.</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </Story>

      <Story title="With image content" description="Card with an avatar image, header, body, and metadata footer.">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@vuejs</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/vuejs.png" alt="@vuejs" />
                <AvatarFallback>VJ</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@vuejs</h4>
                <p className="text-sm">The Progressive JavaScript Framework.</p>
                <div className="text-muted-foreground flex items-center gap-1 pt-2 text-xs">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  <span>Joined December 2013</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Story>

      <Story
        title="Inline mentions in a paragraph"
        description="Multiple HoverCard triggers inline — the @-mention pattern from social tools."
      >
        <p className="max-w-prose text-sm leading-7">
          Big thanks to{' '}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="h-auto px-0 py-0 align-baseline">
                @nuxt
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>NX</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">@nuxt</p>
                  <p className="text-muted-foreground text-xs">The Intuitive Vue Framework.</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{' '}
          and{' '}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="h-auto px-0 py-0 align-baseline">
                @reka-ui
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">@reka-ui</p>
                  <p className="text-muted-foreground text-xs">Unstyled, accessible primitives.</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{' '}
          for the foundations this builds on.
        </p>
      </Story>

      <Story
        title="Placement variants"
        description="HoverCardContent forwards Reka-UI's side and align props — place the card top, right, bottom, or left of the trigger. Defaults to bottom."
      >
        <div className="grid grid-cols-2 place-items-center gap-x-12 gap-y-6 py-12 sm:grid-cols-4">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <HoverCard key={side}>
              <HoverCardTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side={side} className="w-48">
                <p className="text-sm font-medium capitalize">{side} placement</p>
                <p className="text-muted-foreground mt-1 text-xs">side='{side}' on HoverCardContent.</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </Story>
    </>
  )
}
