import Story from '../../components/story/Story'
import { GlobalEdgeNetwork } from '@react-registry-blocks/global-edge-network/GlobalEdgeNetwork'

export default function GlobalEdgeNetworkDemo() {
  return (
    <>
      <Story
        title="Global Edge Network Console"
        description="Cloudflare Radar and Vercel Edge style infrastructure console with real-time anycast telemetry, interactive DottedMapChart with Bezier flow corridors, P95 latency HUD metrics, and live edge node routing table."
      >
        <GlobalEdgeNetwork />
      </Story>
    </>
  )
}
