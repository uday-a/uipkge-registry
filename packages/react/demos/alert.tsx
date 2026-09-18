import { useState } from 'react'
import Story from '../../components/story/Story'
import { Alert, AlertDescription, AlertTitle } from '@react-registry/alert'
import { Button } from '@react-registry/button'
import { AlertCircle, CheckCircle2, Info, RefreshCw, Terminal, TriangleAlert, X } from 'lucide-react'

export default function AlertDemo() {
  const [dismissed, setDismissed] = useState(false)

  return (
    <>
      <Story title="Default" description="Two built-in variants: default and destructive.">
        <Alert>
          <Terminal className="size-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
        </Alert>
      </Story>

      <Story title="Destructive" description="For errors and warnings about data loss.">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      </Story>

      <Story
        title="Tinted icons"
        description="Color the icon for tonal variants — info, success, warning — without changing the alert background."
      >
        <div className="space-y-3">
          <Alert>
            <Info className="text-info size-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Read this carefully — it explains a non-obvious behavior.</AlertDescription>
          </Alert>
          <Alert>
            <CheckCircle2 className="text-success size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes have been saved.</AlertDescription>
          </Alert>
          <Alert>
            <TriangleAlert className="text-warning size-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>This action requires manual review.</AlertDescription>
          </Alert>
        </div>
      </Story>

      <Story
        title="With action button"
        description="Slot a primary action into the description for retryable / actionable alerts. Common for failed-payment or stale-data prompts."
      >
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>The card on file was declined. Try again or use a different method.</span>
            <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
              <RefreshCw className="size-3.5" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </Story>

      <Story
        title="Dismissible"
        description="Pair the alert with conditional rendering and a close button to make it dismissible. The Alert primitive itself is stateless; the host owns the visibility."
      >
        <div className="space-y-2">
          {!dismissed && (
            <Alert className="relative pr-12">
              <Info className="text-info size-4" />
              <AlertTitle>New release available</AlertTitle>
              <AlertDescription>v2.1.0 ships with the new theming engine. See the changelog.</AlertDescription>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground absolute top-2 right-2"
                aria-label="Dismiss"
                onClick={() => setDismissed(true)}
              >
                <X className="size-3.5" />
              </Button>
            </Alert>
          )}
          {dismissed && (
            <Button size="sm" variant="outline" onClick={() => setDismissed(false)}>
              Restore alert
            </Button>
          )}
        </div>
      </Story>
    </>
  )
}
