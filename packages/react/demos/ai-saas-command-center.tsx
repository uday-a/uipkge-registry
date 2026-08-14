import * as React from 'react'
import Story from '../../components/story/Story'
import { AiSaasCommandCenter } from '@react-registry-blocks/ai-saas-command-center/AiSaasCommandCenter'

export default function AiSaasCommandCenterDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Modern AI SaaS platform command center with real-time token burn telemetry, GPU cluster health, latency percentiles, active model workloads, and autonomous agent sessions stream."
      >
        <AiSaasCommandCenter />
      </Story>
    </>
  )
}
