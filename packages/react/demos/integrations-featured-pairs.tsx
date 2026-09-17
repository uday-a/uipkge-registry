import Story from '../../components/story/Story'
import { IntegrationsFeaturedPairs } from '@react-registry-blocks/integrations-featured-pairs/IntegrationsFeaturedPairs'
// IntegrationsFeaturedPairs is the block file the user installs. Open
// `components/blocks/IntegrationsFeaturedPairs.tsx` after install to edit the
// `featured` array; steps render from a plain string list.

export default function IntegrationsFeaturedPairsDemo() {
  return (
    <Story
      title="Integrations — Featured Pairs"
      description="Three promoted integrations. Each card pairs the service with what the connection does, its three setup steps, and a live connection state."
    >
      <IntegrationsFeaturedPairs />
    </Story>
  )
}
