import { useState } from 'react'
import Story from '../../components/story/Story'
import { ScrollProgress } from '@react-registry/scroll-progress'
import { BackTop } from '@react-registry/back-top'

const passages = [
  'The bar above is bound to this box, not to the page. position="absolute" pins it to the top edge of the nearest positioned ancestor, while container tells it which element to measure.',
  'Scroll inside the box and the bar fills relative to the box depth only — the page behind it keeps its own independent progress state.',
  'Because measurement reads scrollTop against scrollHeight minus clientHeight, the math works for any scrollable element: modals, side panels, chat transcripts, or code panes.',
  'Divide-by-zero is guarded: when content is shorter than the viewport of the box, progress simply stays at zero instead of producing NaN.',
  'Swap container at runtime and the listeners re-attach to the new element, so dynamic layouts do not leak scroll handlers.',
  'Everything tears down on unmount — scroll and resize listeners plus any in-flight animation frame.',
]

const filler = [
  'Reading progress is one of those quiet affordances: nobody notices it until it is missing. A slim bar gives long pages a sense of place without spending vertical space.',
  'Keep it out of the way. Three pixels in --primary is usually enough; anything thicker starts competing with real content for attention.',
  'Color is applied straight to the background property, so brand gradients work with no extra plumbing — try a linear-gradient across your chart tokens.',
  'Smoothing eases the bar toward its target each frame with a lerp factor of 0.18, settling within a thousandth. Set smooth={false} for raw one-to-one tracking.',
  'Under prefers-reduced-motion the component drops smoothing automatically and tracks raw scroll, respecting the reader regardless of the prop.',
  'Contained mode swaps fixed positioning for absolute, letting the same primitive serve dashboards, drawers, and split panes.',
  'Layering matters: at z-50 the bar rides above sticky headers at z-40, so the two can coexist without visual collision.',
  'Pair it with a back-to-top action once readers are deep into the page — progress shows how far they have come, the button offers the way back.',
]

export default function ScrollProgressDemo() {
  // Contained mode: capture the scrollable box via ref callback so the bar can measure it.
  const [box, setBox] = useState<HTMLDivElement | null>(null)

  return (
    <div className="space-y-4">
      <Story
        title="Default"
        description="Fixed three-pixel bar in var(--primary), pinned to the viewport top. Scroll the page — every fixed story below tracks the same depth."
      >
        <div className="space-y-3">
          <ScrollProgress />
          <p className="text-muted-foreground text-sm leading-relaxed">
            The bar sits at the very top edge of the viewport. Multiple fixed instances on one demo page stack into
            lanes, so each story below offsets itself a little to stay visible.
          </p>
        </div>
      </Story>

      <Story
        title="Thick editorial"
        description="height={6} turns the bar into part of the reading experience — magazine-style, unmissable."
      >
        <ScrollProgress height={6} className="top-2" />
      </Story>

      <Story
        title="Hairline"
        description="A two-pixel bar in muted-foreground — quiet enough for dense dashboards and docs."
      >
        <ScrollProgress height={2} color="var(--muted-foreground)" className="top-4" />
      </Story>

      <Story
        title="Brand gradient"
        description="color accepts any CSS value, including gradients — applied directly to background."
      >
        <ScrollProgress color="linear-gradient(90deg, var(--chart-1), var(--chart-3))" className="top-6" />
      </Story>

      <Story title="Destructive accent" description="var(--destructive) suits warnings and time-boxed reading flows.">
        <ScrollProgress color="var(--destructive)" className="top-8" />
      </Story>

      <Story
        title="Smooth off"
        description="smooth={false} tracks scroll 1:1 with no lerp — compare it against the smoothed lanes above."
      >
        <div className="space-y-3">
          <ScrollProgress smooth={false} color="var(--chart-2)" className="top-10" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Raw tracking updates state directly in the scroll handler — no animation frame loop is ever started.
          </p>
        </div>
      </Story>

      <div className="space-y-4 py-6">
        {filler.slice(0, 4).map((para, i) => (
          <p key={i} className="text-muted-foreground text-sm leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <Story
        title="Contained mode"
        description='position="absolute" plus container measures a scrollable box instead of the page — pass the element via ref.'
      >
        <div ref={setBox} className="border-border bg-background relative h-56 rounded-md border">
          {box && <ScrollProgress position="absolute" container={box} />}
          <div className="h-full space-y-3 overflow-y-auto p-4">
            {passages.map((para, i) => (
              <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </Story>

      <Story
        title="Article composition"
        description="Header, meta row, and the bar working together in a reading context."
      >
        <article className="space-y-3">
          <ScrollProgress className="top-12" />
          <header className="space-y-1">
            <h3 className="text-lg font-semibold">Designing motion that respects attention</h3>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>Engineering</span>
              <span aria-hidden="true">·</span>
              <span>6 min read</span>
              <span aria-hidden="true">·</span>
              <span>Aug 2026</span>
            </div>
          </header>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Progress indicators earn their place by being glanceable and forgettable at once. This composition keeps the
            chrome minimal: a title, a meta row, and three pixels of state.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">{filler[4]}</p>
        </article>
      </Story>

      <Story
        title="With BackTop"
        description="Compose with the back-top primitive — the bar shows depth, the button offers the way back."
      >
        <div className="space-y-3">
          <ScrollProgress color="linear-gradient(90deg, var(--chart-1), var(--chart-3))" className="top-14" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Scroll past the threshold and the back-top button fades in at the bottom-right corner.
          </p>
          <BackTop />
        </div>
      </Story>

      <Story
        title="Above a sticky header"
        description="z-50 keeps the bar riding above a mocked sticky header strip at z-40 as the page scrolls."
      >
        <div className="relative">
          <div className="bg-background/80 text-muted-foreground sticky top-0 z-40 flex h-10 items-center gap-2 border-b px-4 text-xs backdrop-blur">
            <span className="text-foreground font-medium">Sticky header (z-40)</span>
            <span aria-hidden="true">—</span>
            <span>the default bar overlays it at z-50</span>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Keep scrolling — the header sticks to the viewport top while the progress bar paints over its top edge.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">{filler[6]}</p>
          </div>
        </div>
      </Story>

      <div className="h-96 space-y-4">
        {filler.slice(5).map((para, i) => (
          <p key={i} className="text-muted-foreground text-sm leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}
