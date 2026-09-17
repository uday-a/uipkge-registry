import Story from '../../components/story/Story'
import { AbTestVariantResults } from '@react-registry-blocks/ab-test-variant-results/AbTestVariantResults'

export default function AbTestVariantResultsDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Optimizely & Statsig style A/B test statistical significance scorecard with primary KPI metric cards, variants matrix, and step-by-step conversion funnel drop-off comparison."
      >
        <AbTestVariantResults />
      </Story>

      <Story
        title="Custom Title & Experiment Scope"
        description="Scorecard customized for a pricing page optimization experiment testing annual billing discount tiers."
      >
        <AbTestVariantResults
          title="Pricing Page: Annual Toggle Default vs Monthly Default"
          experimentId="EXP-2041"
          duration="Running for 21 days · 62,400 visitors"
        />
      </Story>
    </>
  )
}
