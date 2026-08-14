import Story from '../../components/story/Story'
import { Logos03 } from '@react-registry-blocks/logos-03/Logos03'

export default function Logos03Demo() {
  return (
    <Story
      title="Three-row marquee, opposite directions"
      description="Row 1 scrolls left at 32s, row 2 scrolls right at 26s, row 3 scrolls left at 38s. Mixed cadence keeps the eye moving. Hover anywhere pauses all rows."
    >
      <Logos03 />
    </Story>
  )
}
