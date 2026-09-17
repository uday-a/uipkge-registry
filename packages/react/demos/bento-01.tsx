import Story from '../../components/story/Story'
import { Bento01 } from '@react-registry-blocks/bento-01/Bento01'

export default function Bento01Demo() {
  return (
    <Story
      title="Bento 01"
      description="Four-tile bento. One 2×2 hero with progress + stats, one 2×1 wide tile, two 1×1 squares (big-number stat + compliance line)."
    >
      <Bento01 />
    </Story>
  )
}
