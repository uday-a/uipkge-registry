import Story from '../../components/story/Story'
import { SecurityCertificationBand } from '@react-registry-blocks/security-certification-band/SecurityCertificationBand'
// SecurityCertificationBand is the block file the user installs. Open
// `components/blocks/SecurityCertificationBand.tsx` after install to edit
// the `certifications` array and wire the residency select.

export default function SecurityCertificationBandDemo() {
  return (
    <Story
      title="Security — Certification Band"
      description="Slim band of certifications with issuing body and last audit date, plus a residency selector — sized to sit above a pricing table."
    >
      <SecurityCertificationBand />
    </Story>
  )
}
