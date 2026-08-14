import Story from '../../components/story/Story'
import { StickyCtaBar } from '@react-registry-blocks/sticky-cta-bar/StickyCtaBar'
// StickyCtaBar is the block file the user installs. Open
// `components/blocks/StickyCtaBar.tsx` after install to change the reveal
// threshold or the copy. The filler paragraphs below only exist so the demo
// has something to scroll — the bar itself watches `window.scrollY`, so it
// needs a page taller than the viewport to reveal. The demo lowers
// `threshold` to 200px because this preview frame is far shorter than a real
// landing page; the block's own default is 480.
const paragraphs = [
  'The bar stays out of the way until a reader has actually gone past the fold. Revealing it immediately turns it into a banner, which is the thing people learned to ignore.',
  'Dismissal is stored in sessionStorage rather than localStorage: closing it silences the offer for this visit without deciding on the reader’s behalf that they never want to see it again.',
  'It renders hidden on the server and on the first client paint, so there is no hydration mismatch and no flash of a bar that then disappears.',
  'Keep scrolling — once you pass the threshold the bar slides up from the bottom edge. Dismiss it and it stays dismissed until this tab is closed.',
]

export default function StickyCtaBarDemo() {
  return (
    <Story
      title="Sticky CTA Bar"
      description="Scroll-triggered bottom CTA. The bar reveals past a scroll threshold with an offer line, inline social proof, primary + ghost actions, and a dismiss control that sticks for the session."
    >
      <div className="mx-auto max-w-2xl space-y-6 pb-40">
        {[...paragraphs, ...paragraphs, ...paragraphs, ...paragraphs].map((paragraph, index) => (
          <p key={index} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <StickyCtaBar threshold={200} />
    </Story>
  )
}
