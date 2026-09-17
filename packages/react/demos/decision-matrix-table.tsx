import Story from '../../components/story/Story'
import { DecisionMatrixTable } from '@react-registry-blocks/decision-matrix-table/DecisionMatrixTable'

export default function DecisionMatrixTableDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Architectural decision matrix with weighted scoring algorithms, RICE framework switcher, interactive criterion weight sliders, dynamic ranking badges, multi-dimensional SVG tradeoff radar, and ADR consensus verdict cards."
      >
        <DecisionMatrixTable />
      </Story>

      <Story
        title="RICE Scoring Framework"
        description="Pre-selected RICE mode evaluating Reach (dev scale), Impact multiplier, Confidence percentage, and Effort sprint complexity."
      >
        <DecisionMatrixTable defaultFramework="rice" />
      </Story>

      <Story
        title="Custom ADR Evaluation"
        description="Decision matrix customized for a UI Framework and Design System modernization initiative across distributed engineering teams."
      >
        <DecisionMatrixTable
          title="Frontend Architecture Modernization Matrix"
          subtitle="Evaluating Next.js vs Nuxt 3 vs Astro Islands vs SvelteKit against team delivery criteria."
        />
      </Story>
    </>
  )
}
