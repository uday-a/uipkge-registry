import Story from '../../components/story/Story'
import { EmptyStates } from '@react-registry-blocks/empty-states/EmptyStates'

export default function EmptyStatesDemo() {
  return (
    <>
      <Story
        title="Gallery"
        description="All six zero-data states in a responsive grid — two columns on tablets, three on desktop."
      >
        <EmptyStates />
      </Story>

      <Story
        title="Nothing here yet"
        description="Single no-data state with a primary Create action and a ghost import path."
      >
        <div className="max-w-md">
          <EmptyStates variant="no-data" />
        </div>
      </Story>

      <Story
        title="No matches"
        description="Single no-search-results state; the primary action clears the active filters."
      >
        <div className="max-w-md">
          <EmptyStates variant="no-search-results" />
        </div>
      </Story>

      <Story title="Welcome" description="Single first-use state with an onboarding action pair.">
        <div className="max-w-md">
          <EmptyStates variant="first-use" />
        </div>
      </Story>

      <Story title="Something broke" description="Single error-recovery state with Retry and a support escape hatch.">
        <div className="max-w-md">
          <EmptyStates variant="error-recovery" />
        </div>
      </Story>

      <Story title="Ask your admin" description="Single no-access state with a permission request pair.">
        <div className="max-w-md">
          <EmptyStates variant="no-access" />
        </div>
      </Story>

      <Story title="Everything synced" description="Single sync-complete state — one ghost action, no pushy CTA.">
        <div className="max-w-md">
          <EmptyStates variant="sync-complete" />
        </div>
      </Story>

      <Story
        title="Custom copy"
        description="title, description, image, and labels on no-data — lift this into an invoices empty state."
      >
        <div className="max-w-md">
          <EmptyStates
            variant="no-data"
            title="No invoices yet"
            description="Create your first invoice to start billing Northwind this quarter."
            primaryLabel="New invoice"
            secondaryLabel="Import CSV"
          />
        </div>
      </Story>

      <Story title="No image" description='image="" hides the HTTP panel and leaves a compact copy card.'>
        <div className="max-w-md">
          <EmptyStates variant="no-search-results" image="" />
        </div>
      </Story>

      <Story title="Compact" description='size="sm" tightens padding and steps actions to xs.'>
        <EmptyStates size="sm" />
      </Story>

      <Story
        title="List layout"
        description='layout="list" stacks centered max-w-md cards — the mobile or sidebar-rail arrangement.'
      >
        <EmptyStates layout="list" />
      </Story>

      <Story
        title="Callbacks"
        description="onPrimary / onSecondary fire from the matching buttons — wire these to your router."
      >
        <div className="max-w-md">
          <EmptyStates
            variant="no-data"
            onPrimary={() => console.log('onPrimary')}
            onSecondary={() => console.log('onSecondary')}
          />
        </div>
      </Story>
    </>
  )
}
