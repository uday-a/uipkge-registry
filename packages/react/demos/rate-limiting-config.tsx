import Story from '../../components/story/Story'
import { RateLimitingConfig } from '@react-registry-blocks/rate-limiting-config/RateLimitingConfig'

export default function RateLimitingConfigDemo() {
  return (
    <Story
      title="Default"
      description="Cloudflare and Upstash style rate limiting configuration panel with real-time health metrics, interactive token bucket simulation engine, and per-endpoint throttling rules."
    >
      <RateLimitingConfig />
    </Story>
  )
}
