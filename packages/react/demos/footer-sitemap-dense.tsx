import Story from '../../components/story/Story'
import { FooterSitemapDense } from '@react-registry-blocks/footer-sitemap-dense/FooterSitemapDense'
// FooterSitemapDense is the block file the user installs. Open
// `components/blocks/FooterSitemapDense.tsx` after install to wire the region
// and currency selects; columns render from one `sections` array.

export default function FooterSitemapDenseDemo() {
  return (
    <Story
      title="Footer — Dense Sitemap"
      description="Sitemap-style footer: six dense link columns over a region and currency selector row, compliance marks, and a live status indicator."
    >
      <FooterSitemapDense />
    </Story>
  )
}
