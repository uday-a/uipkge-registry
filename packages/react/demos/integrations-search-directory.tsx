import Story from '../../components/story/Story'
import { IntegrationsSearchDirectory } from '@react-registry-blocks/integrations-search-directory/IntegrationsSearchDirectory'
// IntegrationsSearchDirectory is the block file the user installs. Open
// `components/blocks/IntegrationsSearchDirectory.tsx` after install to point
// the `integrations` array at your catalog; filtering is plain substring.

export default function IntegrationsSearchDirectoryDemo() {
  return (
    <Story
      title="Integrations — Search Directory"
      description="Live-filtered integration directory. Typing narrows category-grouped rows carrying a monogram, blurb, and auth type; an empty state appears when nothing matches."
    >
      <IntegrationsSearchDirectory />
    </Story>
  )
}
