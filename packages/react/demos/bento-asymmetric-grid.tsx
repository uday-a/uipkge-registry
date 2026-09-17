import Story from '../../components/story/Story'
import { BentoAsymmetricGrid } from '@react-registry-blocks/bento-asymmetric-grid/BentoAsymmetricGrid'
// BentoAsymmetricGrid is the block file the user installs. Open
// `components/blocks/BentoAsymmetricGrid.tsx` after install to re-tile; the
// spans are explicit so rearranging is a class change.

export default function BentoAsymmetricGridDemo() {
  return (
    <Story
      title="Bento — Asymmetric Grid"
      description="Five-tile asymmetric bento anchored by one tall tile, the rest carrying a metric, a list, a status, and a quote."
    >
      <BentoAsymmetricGrid />
    </Story>
  )
}
