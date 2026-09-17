import Story from '../../components/story/Story'
import { ErrorPages } from '@react-registry-blocks/error-pages/ErrorPages'

export default function ErrorPagesDemo() {
  return (
    <>
      <Story
        title="Gallery"
        description="All four status screens in a two-column grid — each card shows the matching HTTP response."
      >
        <ErrorPages />
      </Story>

      <Story
        title="Page not found"
        description="Single 404 — GET /pricing/teams → 404 Not Found. Go home primary, Search docs ghost."
      >
        <div className="max-w-xl">
          <ErrorPages variant="404" />
        </div>
      </Story>

      <Story
        title="Internal server error"
        description="Single 500 — POST /api/v1/invoices → 500 Internal Server Error. Retry with icon, Status page outline."
      >
        <div className="max-w-xl">
          <ErrorPages variant="500" />
        </div>
      </Story>

      <Story
        title="Access denied"
        description="Single 403 — GET /admin/billing → 403 Forbidden. Switch account outline next to Request access."
      >
        <div className="max-w-xl">
          <ErrorPages variant="403" />
        </div>
      </Story>

      <Story
        title="Scheduled maintenance"
        description="Single 503 — ETA pill under the copy and Subscribe for updates. Pass tag to rewrite the pill."
      >
        <div className="max-w-xl">
          <ErrorPages variant="maintenance" />
        </div>
      </Story>

      <Story
        title="Custom copy"
        description="title, description, code, tag, and action labels on a 404 — lift this into a branded empty route."
      >
        <div className="max-w-xl">
          <ErrorPages
            variant="404"
            code="4xx"
            title="This workspace moved"
            description="Acme migrated docs to /help. The old URL is retired."
            tag="Redirects expire 30 Sep"
            primaryLabel="Open help center"
            secondaryLabel="Contact docs"
          />
        </div>
      </Story>

      <Story title="No image" description='image="" on a single 500 hides the HTTP panel and leaves a copy card.'>
        <div className="max-w-xl">
          <ErrorPages variant="500" image="" />
        </div>
      </Story>

      <Story
        title="Disabled actions"
        description="primaryDisabled / secondaryDisabled freeze the 500 Retry while the incident is still open."
      >
        <div className="max-w-xl">
          <ErrorPages variant="500" primaryDisabled secondaryDisabled />
        </div>
      </Story>

      <Story
        title="Wired callbacks"
        description="onHome / onSearch / onRetry fire from the matching buttons — wire these to your router."
      >
        <div className="max-w-xl">
          <ErrorPages variant="404" onHome={() => console.log('onHome')} onSearch={() => console.log('onSearch')} />
        </div>
      </Story>

      <Story
        title="Hide secondary"
        description="showSecondary=false leaves a single primary on maintenance; pass secondaryLabel to add a second action."
      >
        <div className="max-w-xl">
          <ErrorPages variant="maintenance" showSecondary={false} tag="Back online 14:00 UTC" />
        </div>
      </Story>

      <Story title="Compact" description='size="sm" drops padding, tightens the title, and steps down the actions.'>
        <ErrorPages size="sm" />
      </Story>
    </>
  )
}
