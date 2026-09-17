import Story from '../../components/story/Story'
import {
  ProductComparisonDrawer,
  DEFAULT_COMPARISON_PRODUCTS,
} from '@react-registry-blocks/product-comparison-drawer/ProductComparisonDrawer'

const twoProducts = DEFAULT_COMPARISON_PRODUCTS.slice(0, 2)

export default function ProductComparisonDrawerDemo() {
  return (
    <>
      <Story
        title="Floating Comparison Dock (Default)"
        description="Sticky bottom dock bar with product thumbnails, item count badge, remove triggers, and expand toggle over a category catalog preview."
      >
        <ProductComparisonDrawer />
      </Story>

      <Story
        title="Expanded Specification Matrix"
        description="Full side-by-side technical matrix comparing drivers, battery life, ANC, water resistance, weight, and in-box accessories with sticky buy triggers."
      >
        <ProductComparisonDrawer mode="expanded" />
      </Story>

      <Story
        title="Highlight Differences Only"
        description="Comparison matrix with difference highlight toggle enabled, spotlighting contrasting attributes and dimming identical specifications."
      >
        <ProductComparisonDrawer mode="expanded" defaultHighlightDiffs={true} />
      </Story>

      <Story
        title="Two-Product Head-to-Head"
        description="Direct 2-product specification duel between over-ear studio headphones and true wireless earbuds."
      >
        <ProductComparisonDrawer mode="expanded" products={twoProducts} />
      </Story>
    </>
  )
}
