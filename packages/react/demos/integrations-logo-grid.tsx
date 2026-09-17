import Story from '../../components/story/Story'
import { IntegrationsLogoGrid } from '@react-registry-blocks/integrations-logo-grid/IntegrationsLogoGrid'
// IntegrationsLogoGrid is the block file the user installs. Open
// `components/blocks/IntegrationsLogoGrid.tsx` after install and swap the
// monogram tiles for real logos — the grid sizes to whatever you drop in.

export default function IntegrationsLogoGridDemo() {
  return (
    <Story
      title="Integrations — Logo Grid"
      description="Category chips filter a wall of square integration tiles. Each tile names its integration on hover; a count line and request prompt close the section."
    >
      <IntegrationsLogoGrid />
    </Story>
  )
}
