import Story from '../../components/story/Story'
import { HeaderTransparentScroll } from '@react-registry-blocks/header-transparent-scroll/HeaderTransparentScroll'
// HeaderTransparentScroll is the block file the user installs. Open
// `components/blocks/HeaderTransparentScroll.tsx` after install to edit the
// links or the scroll threshold that swaps the surface in. The filler
// paragraphs below only exist so the demo has something to scroll — the
// header watches `window.scrollY`, so it needs a page taller than the
// viewport to show the surface fade in.
const paragraphs = [
  'The header starts transparent so it can sit over a hero without drawing a box around itself.',
  'Past the first scroll it fades in a blurred, bordered surface — the same chrome as the fixed header, deferred until the page actually moves.',
  'It starts unscrolled on the server and on the first client paint, so there is no hydration mismatch.',
  'Keep scrolling — the surface stays for the rest of the page.',
]

export default function HeaderTransparentScrollDemo() {
  return (
    <Story
      title="Header — Transparent Over Hero"
      description="Navbar that starts transparent over the hero and fades in a blurred, bordered surface past the first scroll. Scroll the demo to see the transition; the mobile menu opens in a sheet."
    >
      <HeaderTransparentScroll />
      <div className="mx-auto max-w-2xl space-y-6 px-6 py-24">
        {[...paragraphs, ...paragraphs, ...paragraphs, ...paragraphs].map((paragraph, index) => (
          <p key={index} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </Story>
  )
}
