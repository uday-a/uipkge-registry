import Story from '../../components/story/Story'
import { Error500 } from '@react-registry-blocks/error-500/Error500'

export default function Error500Demo() {
  return (
    <>
      <Story
        title="Default"
        description="Full-page 500 — HTTP 500 response panel, display code, Try again + Back to home + Contact support."
      >
        <Error500 layout="contained" />
      </Story>

      <Story title="Page layout" description='layout="page" fills the viewport height for a dedicated error route.'>
        <div className="max-h-[32rem] overflow-auto">
          <Error500 />
        </div>
      </Story>

      <Story title="Custom copy" description="title, description, and code rewrite the incident for a named outage.">
        <Error500
          layout="contained"
          code="503"
          title="Billing API is down"
          description="Checkout is paused while we restart the billing workers. Existing invoices are safe — retry in a minute."
          primaryLabel="Retry checkout"
          secondaryLabel="Status page"
          tertiaryLabel="Email on-call"
        />
      </Story>

      <Story title="No image" description='image="" hides the HTTP panel and leaves a copy-only stack.'>
        <Error500 layout="contained" image="" />
      </Story>

      <Story title="Hide tertiary" description="showTertiary=false drops Contact support, leaving retry + home.">
        <Error500 layout="contained" showTertiary={false} />
      </Story>

      <Story title="Disabled retry" description="primaryDisabled freezes Try again while the incident is still open.">
        <Error500 layout="contained" primaryDisabled />
      </Story>

      <Story title="Hrefs" description="primaryHref, secondaryHref, and tertiaryHref render the actions as links.">
        <Error500 layout="contained" primaryHref="#retry" secondaryHref="/" tertiaryHref="/support" />
      </Story>

      <Story title="Callbacks" description="onPrimary / onSecondary / onTertiary fire from the matching buttons.">
        <Error500
          layout="contained"
          onPrimary={() => console.log('onPrimary')}
          onSecondary={() => console.log('onSecondary')}
          onTertiary={() => console.log('onTertiary')}
        />
      </Story>

      <Story title="Single action" description="Only Try again — secondary and tertiary hidden for a hard-fail screen.">
        <Error500 layout="contained" showSecondary={false} showTertiary={false} />
      </Story>
    </>
  )
}
