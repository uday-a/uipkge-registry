import * as React from 'react'
import Story from '../../components/story/Story'
import { ModelTokenCostOptimizer } from '@react-registry-blocks/model-token-cost-optimizer/ModelTokenCostOptimizer'

export default function ModelTokenCostOptimizerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Helicone and Portkey style AI gateway telemetry, semantic caching hit rates, model routing savings, and latency metrics dashboard with token spend analytics, model allocation breakdown, and active cost optimization rules."
      >
        <ModelTokenCostOptimizer />
      </Story>
    </>
  )
}
