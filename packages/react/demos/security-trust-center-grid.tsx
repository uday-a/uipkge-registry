import Story from '../../components/story/Story'
import { SecurityTrustCenterGrid } from '@react-registry-blocks/security-trust-center-grid/SecurityTrustCenterGrid'
// SecurityTrustCenterGrid is the block file the user installs. Open
// `components/blocks/SecurityTrustCenterGrid.tsx` after install to point the
// report links at your trust centre.

export default function SecurityTrustCenterGridDemo() {
  return (
    <Story
      title="Security — Trust Centre Grid"
      description="Compliance programmes with audit date, scope, and report link, over a row of operational controls written as facts rather than reassurance."
    >
      <SecurityTrustCenterGrid />
    </Story>
  )
}
