import Story from '../../components/story/Story'
import { TextReveal } from '@react-registry/text-reveal'
import { GradientText } from '@react-registry/gradient-text'
import { SectionCard } from '@react-registry/section-card'

export default function TextRevealDemo() {
  return (
    <>
      <Story title="Default" description="Word-by-word reveal on a heading. Scroll it into view to trigger.">
        <TextReveal
          as="h2"
          text="Compose interfaces from source you own"
          className="text-3xl font-bold tracking-tight"
        />
      </Story>

      <Story title="Character mode" description="Per-character stagger on a short word.">
        <TextReveal text="Registry" mode="chars" stagger={35} className="text-3xl font-bold tracking-tight" />
      </Story>

      <Story
        title="No blur"
        description="Fade and rise only — blur disabled for small sizes where blur reads as smudge."
      >
        <TextReveal text="Crisp entrance without the blur pass" blur={false} className="text-lg font-medium" />
      </Story>

      <Story title="Slow cinematic" description="Long duration and wide stagger for hero moments.">
        <TextReveal
          text="Design engineering, distilled"
          duration={900}
          stagger={90}
          className="text-4xl font-bold tracking-tight"
        />
      </Story>

      <Story title="Snappy" description="Fast duration and tight stagger for UI chrome.">
        <TextReveal text="Instant, tactile, precise" duration={300} stagger={20} className="text-base font-medium" />
      </Story>

      <Story title="Paragraph" description="Longer body copy reveals word by word at reading size.">
        <TextReveal
          text="Every component ships as source code you copy into your project. No runtime dependency, no version lock — edit anything after installing."
          className="text-muted-foreground max-w-prose text-sm leading-relaxed"
        />
      </Story>

      <Story title="With GradientText" description="Composed with the gradient-text primitive for a branded headline.">
        <h2 className="text-3xl font-bold tracking-tight">
          <TextReveal text="Ship your ideas at" stagger={50} />
          &nbsp;
          <GradientText preset="sunset">lightspeed.</GradientText>
        </h2>
      </Story>

      <Story title="Replayable" description="once=false re-hides when scrolled out — scroll away and back to replay.">
        <div className="bg-card max-h-48 overflow-y-auto rounded-lg border p-6">
          <div className="h-24"></div>
          <TextReveal text="Scroll me out of view, then back in" once={false} className="text-xl font-semibold" />
          <div className="h-24"></div>
        </div>
      </Story>

      <Story title="Inside a card" description="Section header reveal within a SectionCard.">
        <SectionCard title="Quarterly report" description="Revealed on scroll">
          <TextReveal text="Revenue grew forty percent year over year" className="text-lg font-medium" />
        </SectionCard>
      </Story>

      <Story title="Display size" description="Large display heading with tight tracking.">
        <TextReveal
          as="h1"
          text="The component registry for Vue and React"
          stagger={60}
          className="text-5xl font-bold tracking-tighter"
        />
      </Story>

      <Story title="Caption / meta" description="Small uppercase meta text with a gentle stagger.">
        <TextReveal
          text="Trusted by design engineers everywhere"
          stagger={25}
          duration={400}
          className="text-muted-foreground text-xs font-medium tracking-widest uppercase"
        />
      </Story>
    </>
  )
}
