import Story from '../../components/story/Story'
import { WebhookTester } from '@react-registry-blocks/webhook-tester/WebhookTester'

export default function WebhookTesterDemo() {
  return (
    <Story
      title="Webhook Tester"
      description="Svix and Stripe style live webhook delivery inspector and event simulator. Features event payload selection, inline JSON editing, HMAC-SHA256 signature verification preview, live delivery attempt logs, request/response headers, and retry telemetry."
    >
      <WebhookTester />
    </Story>
  )
}
