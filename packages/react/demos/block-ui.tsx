import { useState } from "react";
import Story from "../../components/story/Story";
import { BlockUi } from "@react-registry/block-ui";
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
import { CloudUpload, Database, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlockUiDemo() {
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function saveSettings() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 2200));
    setSaving(false);
  }

  async function fetchReport() {
    setFetching(true);
    await new Promise((r) => setTimeout(r, 2500));
    setFetching(false);
  }

  async function syncData() {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 3000));
    setSyncing(false);
  }

  return (
    <>
      <Story
        title="Settings form during save"
        description="Block the whole card while a save request is in flight so users can't edit stale fields mid-submit."
      >
        <div className="max-w-md">
          <BlockUi blocking={saving} message="Saving your changes…">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project settings</CardTitle>
                <CardDescription>
                  Changes apply to all team members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Project name</Label>
                  <Input defaultValue="Acme Website Redesign" />
                </div>
                <div className="space-y-1.5">
                  <Label>Owner</Label>
                  <Input defaultValue="sarah.johnson@acme.com" />
                </div>
                <Button
                  className="w-full"
                  disabled={saving}
                  onClick={saveSettings}
                >
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </CardContent>
            </Card>
          </BlockUi>
        </div>
      </Story>

      <Story
        title="Data fetch with blur"
        description="Blur the stale content while fresh data loads — signals that what's behind the overlay is about to change."
      >
        <div className="flex max-w-md flex-col gap-3">
          <Button
            variant="outline"
            className="w-fit"
            disabled={fetching}
            onClick={fetchReport}
          >
            <RefreshCw
              className={cn("mr-2 size-4", fetching ? "animate-spin" : "")}
            />
            Refresh report
          </Button>
          <BlockUi blocking={fetching} blur message="Loading report…">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Q3 revenue summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total revenue</span>
                  <span className="font-medium tabular-nums">$1,284,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New customers</span>
                  <span className="font-medium tabular-nums">342</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Churn rate</span>
                  <span className="font-medium tabular-nums">2.1%</span>
                </div>
              </CardContent>
            </Card>
          </BlockUi>
        </div>
      </Story>

      <Story
        title="Custom overlay icon"
        description="Swap the spinner for a context-relevant icon — here a cloud upload glyph during a file sync."
      >
        <div className="flex max-w-md flex-col gap-3">
          <Button
            variant="outline"
            className="w-fit"
            disabled={syncing}
            onClick={syncData}
          >
            <CloudUpload className="mr-2 size-4" />
            {syncing ? "Syncing…" : "Sync to cloud"}
          </Button>
          <BlockUi
            blocking={syncing}
            showSpinner={false}
            message="Uploading 14 files…"
            icon={<CloudUpload className="text-primary size-8 animate-pulse" />}
          >
            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-medium">Cloud storage</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  3.2 GB of 10 GB used · 14 files pending
                </p>
              </CardContent>
            </Card>
          </BlockUi>
        </div>
      </Story>

      <Story
        title="Rich message slot"
        description="Replace the plain text message with a two-line status — title plus a reassuring subtitle."
      >
        <BlockUi
          blocking
          showSpinner={false}
          className="max-w-md"
          icon={<ShieldCheck className="text-primary size-8" />}
          messageSlot={
            <div className="text-center">
              <p className="text-sm font-medium">Auditing schema</p>
              <p className="text-muted-foreground text-xs">
                This usually takes a few seconds
              </p>
            </div>
          }
        >
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium">Compliance check</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Running 42 rules against the current schema…
              </p>
            </CardContent>
          </Card>
        </BlockUi>
      </Story>

      <Story
        title="Overlay appearance"
        description="Tune opacity and overlay color — a lower opacity keeps content visible, a dark tint reads as a hard block."
      >
        <div className="grid max-w-md gap-4 sm:grid-cols-2">
          <BlockUi
            blocking
            opacity={0.3}
            message="Light veil"
            showSpinner={false}
          >
            <Card>
              <CardContent className="p-5">
                <p className="text-sm">30% opacity</p>
                <p className="text-muted-foreground text-xs">
                  Subtle — content stays readable.
                </p>
              </CardContent>
            </Card>
          </BlockUi>
          <BlockUi
            blocking
            overlayColor="#0a0a0a"
            opacity={0.7}
            message="Hard block"
            showSpinner={false}
          >
            <Card>
              <CardContent className="p-5">
                <p className="text-sm">Dark overlay</p>
                <p className="text-muted-foreground text-xs">
                  Opaque — focus is forced to the message.
                </p>
              </CardContent>
            </Card>
          </BlockUi>
        </div>
      </Story>

      <Story
        title="Database migration panel"
        description="A realistic always-blocked state — the kind you show while a long-running migration is in progress."
      >
        <BlockUi
          blocking
          message="Running migration 0042…"
          className="max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="size-4" />
                Database migrations
              </CardTitle>
              <CardDescription>
                Applied migrations are listed below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <p className="text-muted-foreground text-xs">
                0039 · add_users_table · ✓
              </p>
              <p className="text-muted-foreground text-xs">
                0040 · add_audit_log · ✓
              </p>
              <p className="text-muted-foreground text-xs">
                0041 · index_trails · ✓
              </p>
              <p className="text-xs">0042 · split_orgs · running…</p>
            </CardContent>
          </Card>
        </BlockUi>
      </Story>
    </>
  );
}
