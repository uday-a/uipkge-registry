import Story from '../../components/story/Story'
import { FrequentlyBoughtTogether } from '@react-registry-blocks/frequently-bought-together/FrequentlyBoughtTogether'

export default function FrequentlyBoughtTogetherDemo() {
  return (
    <Story
      title="Frequently Bought Together"
      description="Amazon and Shopify-style bundle builder and cross-sell module with reactive checkbox selection, live discount calculation, and bundle savings badge."
    >
      <FrequentlyBoughtTogether />
    </Story>
  )
}
