import Story from '../../components/story/Story'
import { FooterBrandStatement } from '@react-registry-blocks/footer-brand-statement/FooterBrandStatement'
// FooterBrandStatement is the block file the user installs. Open
// `components/blocks/FooterBrandStatement.tsx` after install to replace the
// statement — it is the only oversized type on the page, so keep it short.

export default function FooterBrandStatementDemo() {
  return (
    <Story
      title="Footer — Brand Statement"
      description="Footer led by an oversized brand statement and mission line, with three link columns beneath and a legal row carrying certifications and a contact address."
    >
      <FooterBrandStatement />
    </Story>
  )
}
