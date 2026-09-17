import Story from '../../components/story/Story'
import { FooterMinimalRow } from '@react-registry-blocks/footer-minimal-row/FooterMinimalRow'
// FooterMinimalRow is the block file the user installs. Open
// `components/blocks/FooterMinimalRow.tsx` after install to edit the links;
// the row wraps to two lines below the small breakpoint.

export default function FooterMinimalRowDemo() {
  return (
    <Story
      title="Footer — Minimal Row"
      description="Single-row footer — wordmark, short inline link list, social icons, and copyright. For pages that should end quietly rather than with a sitemap."
    >
      <FooterMinimalRow />
    </Story>
  )
}
