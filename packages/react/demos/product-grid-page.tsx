import Story from '../../components/story/Story'
import { ProductGridPage } from '@react-registry-blocks/product-grid-page/ProductGridPage'

export default function ProductGridPageDemo() {
  return (
    <Story
      title="Default"
      description="E-commerce product listing page (PLP) featuring breadcrumb navigation, category header with sort dropdown and mobile filter drawer, multi-facet sidebar (categories, price range slider, color swatches, brands, ratings), and a responsive 3-column product grid with badges, wishlist toggle, quick add to cart, and pagination."
    >
      <ProductGridPage />
    </Story>
  )
}
