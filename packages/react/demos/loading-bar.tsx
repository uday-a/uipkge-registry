import { useState } from "react";
import Story from "../../components/story/Story";
import { LoadingBar, useLoadingBar } from "@react-registry/loading-bar";
import { Button } from "@react-registry/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { Input } from "@react-registry/input";
import { Label } from "@react-registry/label";
import { Loader2, Save, AlertCircle } from "lucide-react";

export default function LoadingBarDemo() {
  const pageBar = useLoadingBar();
  const formBar = useLoadingBar();
  const bottomBar = useLoadingBar();

  const [manualValue, setManualValue] = useState(40);
  const [formStatus, setFormStatus] = useState<
    "idle" | "saving" | "done" | "error"
  >("idle");

  async function simulatePageLoad() {
    pageBar.start();
    await new Promise((r) => setTimeout(r, 1800));
    pageBar.finish();
  }

  async function simulateApiError() {
    pageBar.start();
    await new Promise((r) => setTimeout(r, 1400));
    pageBar.error();
  }

  async function submitForm() {
    setFormStatus("saving");
    formBar.start();
    await new Promise((r) => setTimeout(r, 2000));
    formBar.finish();
    setFormStatus("done");
    setTimeout(() => setFormStatus("idle"), 1500);
  }

  async function runBottomBar() {
    bottomBar.start();
    await new Promise((r) => setTimeout(r, 1800));
    bottomBar.finish();
  }

  return (
    <div className="space-y-8">
      <LoadingBar ref={pageBar.setRef} />
      <LoadingBar ref={formBar.setRef} color="#22c55e" />
      <LoadingBar ref={bottomBar.setRef} position="bottom" color="#6366f1" />

      <Story
        title="Page navigation"
        description="The classic top-of-viewport bar that fills while a route or heavy page loads. Click to simulate a 1.8s navigation."
      >
        <div className="flex flex-wrap gap-2">
          <Button onClick={simulatePageLoad}>
            <Loader2
              className="mr-2 size-4 animate-spin"
              style={{ opacity: pageBar.loading ? 1 : 0 }}
            />
            Load dashboard
          </Button>
          <Button variant="destructive" onClick={simulateApiError}>
            <AlertCircle className="mr-2 size-4" />
            Failing request
          </Button>
          <Button variant="outline" onClick={() => pageBar.inc(15)}>
            Nudge +15%
          </Button>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          The bar auto-hides when finished. The error variant tints the bar
          destructive so users know something went wrong.
        </p>
      </Story>

      <Story
        title="Form submission"
        description="Block the submit button and run a green bar while the save request is in flight, then clear on success."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-base">Billing details</CardTitle>
            <CardDescription>
              Updates are saved to your account instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Company name</Label>
              <Input defaultValue="Acme Inc." />
            </div>
            <div className="space-y-1.5">
              <Label>Billing email</Label>
              <Input defaultValue="billing@acme.com" />
            </div>
            <Button
              className="w-full"
              disabled={formStatus === "saving"}
              onClick={submitForm}
            >
              <Save className="mr-2 size-4" />
              {formStatus === "saving"
                ? "Saving…"
                : formStatus === "done"
                  ? "Saved!"
                  : "Save changes"}
            </Button>
            {formStatus === "done" && (
              <p className="text-xs text-emerald-600">
                Your billing details were updated.
              </p>
            )}
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Manual control"
        description="Bind value when you know the exact progress — e.g. a file upload reporting bytes transferred."
      >
        <div className="max-w-md space-y-3">
          <LoadingBar
            value={manualValue}
            height={4}
            onValueChange={setManualValue}
          />
          <input
            value={manualValue}
            onChange={(e) => setManualValue(Number(e.target.value))}
            type="range"
            min={0}
            max={100}
            className="w-full"
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Transferred</span>
            <span className="tabular-nums">{manualValue}%</span>
          </div>
        </div>
      </Story>

      <Story
        title="Indeterminate fetching"
        description="When you can't estimate the remaining work, indeterminate slides a segment across the viewport top."
      >
        <div className="flex items-center gap-3">
          <LoadingBar indeterminate spinner height={3} />
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            Fetching results…
          </span>
        </div>
      </Story>

      <Story
        title="Bottom-anchored bar"
        description="position='bottom' pins the bar to the lower viewport edge — handy for background sync tasks that shouldn't distract from content."
      >
        <Button variant="outline" onClick={runBottomBar}>
          <Loader2
            className="mr-2 size-4 animate-spin"
            style={{ opacity: bottomBar.loading ? 1 : 0 }}
          />
          Sync in background
        </Button>
        <p className="text-muted-foreground mt-3 text-xs">
          Watch the bottom of the viewport after clicking.
        </p>
      </Story>

      <Story
        title="Appearance options"
        description="Color, height, and error state — the building blocks for matching the bar to your theme."
      >
        <div className="grid max-w-md gap-4">
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">
              Custom color + height
            </span>
            <LoadingBar value={70} color="#10b981" height={6} />
          </div>
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">Error state</span>
            <LoadingBar value={85} error height={6} />
          </div>
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">
              Indeterminate + spinner
            </span>
            <LoadingBar indeterminate spinner color="#f59e0b" height={4} />
          </div>
        </div>
      </Story>
    </div>
  );
}
