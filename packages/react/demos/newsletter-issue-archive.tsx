import Story from '../../components/story/Story'
import { NewsletterIssueArchive } from '@react-registry-blocks/newsletter-issue-archive/NewsletterIssueArchive'

export default function NewsletterIssueArchiveDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Substack/Beehiiv style publication archive with hero subscription form, featured issue spotlight, interactive category filtering, live search, and edition cards."
      >
        <NewsletterIssueArchive />
      </Story>

      <Story
        title="Custom Publication Branding"
        description="Archive customized for a specialized frontend architecture digest with tailored headline, description, and subscriber counter."
      >
        <NewsletterIssueArchive
          publicationName="Design Tokens Dispatch"
          subtitle="In-depth explorations of modern multi-brand token pipelines, OKLCH color science, and component registry infrastructure."
          subscriberCount="18,200+ Subscribers · Top 5% on Substack"
        />
      </Story>
    </>
  )
}
