import Story from '../../components/story/Story'
import { NewsletterSplitPreview } from '@react-registry-blocks/newsletter-split-preview/NewsletterSplitPreview'
// NewsletterSplitPreview is the block file the user installs. Open
// `components/blocks/NewsletterSplitPreview.tsx` after install to feed the
// preview from your archive.

export default function NewsletterSplitPreviewDemo() {
  return (
    <Story
      title="Newsletter — Split with Preview"
      description="Pitch and form beside a preview of the last issue: subject line, date, and opening paragraph, so the offer is legible before anyone types an address."
    >
      <NewsletterSplitPreview />
    </Story>
  )
}
