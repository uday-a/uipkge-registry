import Story from '../../components/story/Story'
import { IntegrationsConnectorStatus } from '@react-registry-blocks/integrations-connector-status/IntegrationsConnectorStatus'
// IntegrationsConnectorStatus is the block file the user installs. Open
// `components/blocks/IntegrationsConnectorStatus.tsx` after install to feed
// the `connectors` array from your status endpoint.

export default function IntegrationsConnectorStatusDemo() {
  return (
    <Story
      title="Integrations — Connector Status"
      description="Connector health table. Each integration lists auth method, sync cadence, last successful run, and a status pill, above a summary band of healthy and degraded counts."
    >
      <IntegrationsConnectorStatus />
    </Story>
  )
}
