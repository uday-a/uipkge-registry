import Story from '../../components/story/Story'
import { Marquee } from '@react-registry/marquee'
import { Avatar, AvatarFallback } from '@react-registry/avatar'
import { Badge } from '@react-registry/badge'

export default function MarqueeDemo() {
  return (
    <>
      <Story
        title="Horizontal (default)"
        description="Content scrolls leftward. The slot is duplicated for a seamless loop."
      >
        <Marquee className="bg-muted/40 rounded-md py-3">
          {['Vue', 'React', 'Astro', 'Tailwind', 'Reka UI', 'Vite'].map((t) => (
            <span key={t} className="px-2 text-sm font-medium">
              {t}
            </span>
          ))}
        </Marquee>
      </Story>

      <Story title="Direction right" description="direction='right' reverses the travel direction.">
        <Marquee direction="right" className="bg-muted/40 rounded-md py-3">
          {['Vue', 'React', 'Astro', 'Tailwind', 'Reka UI', 'Vite'].map((t) => (
            <span key={t} className="px-2 text-sm font-medium">
              {t}
            </span>
          ))}
        </Marquee>
      </Story>

      <Story title="Speed" description="speed is the animation duration in seconds. Lower = faster.">
        <Marquee speed={8} className="bg-muted/40 rounded-md py-3">
          {['Fast', 'Fast', 'Fast', 'Fast', 'Fast', 'Fast'].map((t, i) => (
            <span key={t + i} className="px-2 text-sm font-medium">
              {t}
            </span>
          ))}
        </Marquee>
      </Story>

      <Story title="Slow" description="A high speed value produces a slow, ambient scroll.">
        <Marquee speed={40} className="bg-muted/40 rounded-md py-3">
          {['Slow', 'Slow', 'Slow', 'Slow', 'Slow', 'Slow'].map((t, i) => (
            <span key={t + i} className="px-2 text-sm font-medium">
              {t}
            </span>
          ))}
        </Marquee>
      </Story>

      <Story title="Pause on hover" description="Hover the row to freeze the animation.">
        <Marquee pauseOnHover className="bg-muted/40 rounded-md py-3">
          {['Hover', 'me', 'to', 'pause', 'the', 'scroll'].map((t) => (
            <span key={t} className="px-2 text-sm font-medium">
              {t}
            </span>
          ))}
        </Marquee>
      </Story>

      <Story title="Paused" description="paused=true hard-stops the animation.">
        <Marquee paused className="bg-muted/40 rounded-md py-3">
          {['Frozen', 'Frozen', 'Frozen', 'Frozen'].map((t, i) => (
            <span key={t + i} className="px-2 text-sm font-medium">
              {t}
            </span>
          ))}
        </Marquee>
      </Story>

      <Story title="Gap" description="gap controls spacing between repeated groups (px).">
        <Marquee gap={48} className="bg-muted/40 rounded-md py-3">
          {['A', 'B', 'C', 'D'].map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </Marquee>
      </Story>

      <Story title="Repeat" description="repeat sets how many copies of the slot are rendered.">
        <Marquee repeat={3} className="bg-muted/40 rounded-md py-3">
          {['x3', 'x3', 'x3'].map((t, i) => (
            <span key={t + i} className="px-2 text-sm font-medium">
              {t}
            </span>
          ))}
        </Marquee>
      </Story>

      <Story title="Vertical" description="orientation='vertical' scrolls content upward.">
        <Marquee orientation="vertical" direction="up" speed={12} className="bg-muted/40 h-48 w-48 rounded-md">
          {Array.from({ length: 8 }, (_, n) => (
            <div key={n} className="flex items-center gap-2 py-2">
              <Avatar className="size-6">
                <AvatarFallback className="text-xs">{n + 1}</AvatarFallback>
              </Avatar>
              <span className="text-sm">User {n + 1}</span>
            </div>
          ))}
        </Marquee>
      </Story>

      <Story title="Vertical down" description="direction='down' reverses the vertical travel.">
        <Marquee orientation="vertical" direction="down" speed={12} className="bg-muted/40 h-48 w-48 rounded-md">
          {Array.from({ length: 8 }, (_, n) => (
            <div key={n} className="flex items-center gap-2 py-2">
              <Avatar className="size-6">
                <AvatarFallback className="text-xs">{n + 1}</AvatarFallback>
              </Avatar>
              <span className="text-sm">User {n + 1}</span>
            </div>
          ))}
        </Marquee>
      </Story>

      <Story title="Avatars row" description="A common use case: an infinite logo / avatar strip.">
        <Marquee speed={15} gap={24} className="py-2">
          {Array.from({ length: 10 }, (_, n) => (
            <Avatar key={n} className="ring-background size-10 ring-2">
              <AvatarFallback>U{n + 1}</AvatarFallback>
            </Avatar>
          ))}
        </Marquee>
      </Story>
    </>
  )
}
