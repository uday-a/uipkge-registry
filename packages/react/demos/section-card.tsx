import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import { Input } from "@react-registry/input";
import { Label } from "@react-registry/label";
import { SectionCard } from "@react-registry/section-card";
import { Textarea } from "@react-registry/textarea";
import { MoreHorizontal, Plus, RefreshCw, Settings } from "lucide-react";

export default function SectionCardDemo() {
  return (
    <>
      <Story
        title="With icon action"
        description="Labeled card with title, description, and a single icon in the corner action slot."
      >
        <SectionCard
          title="Account settings"
          description="Manage your profile and preferences."
          headerAction={<Settings className="text-muted-foreground size-4" />}
        >
          <p className="text-muted-foreground text-sm">
            Use SectionCard to wrap a labeled section with optional header
            description and a corner action.
          </p>
        </SectionCard>
      </Story>

      <Story
        title="Without action"
        description="Header-action slot is optional — drop it for plain titled sections."
      >
        <SectionCard
          title="About"
          description="A short summary of this account."
        >
          <p className="text-muted-foreground text-sm">
            No action slot is rendered here, so the title aligns flush with no
            trailing affordance.
          </p>
        </SectionCard>
      </Story>

      <Story
        title="Multiple actions"
        description="The header-action slot accepts any node — group buttons in a flex container."
      >
        <SectionCard
          title="Team members"
          description="People with access to this workspace."
          headerAction={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="size-3.5" /> Sync
              </Button>
              <Button size="sm">
                <Plus className="size-3.5" /> Invite
              </Button>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          }
        >
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Alice Anderson</span>
              <span className="text-muted-foreground">Owner</span>
            </li>
            <li className="flex justify-between">
              <span>Bob Bailey</span>
              <span className="text-muted-foreground">Admin</span>
            </li>
            <li className="flex justify-between">
              <span>Carol Chen</span>
              <span className="text-muted-foreground">Member</span>
            </li>
          </ul>
        </SectionCard>
      </Story>

      <Story
        title="Stacked sections"
        description="Multiple SectionCards stacked vertically — a typical settings-page pattern."
      >
        <div className="space-y-4">
          <SectionCard
            title="Profile"
            description="Your public-facing identity."
          >
            <p className="text-muted-foreground text-sm">
              Name, avatar, and bio.
            </p>
          </SectionCard>
          <SectionCard
            title="Notifications"
            description="Email and in-app preferences."
          >
            <p className="text-muted-foreground text-sm">
              Choose which events alert you and how.
            </p>
          </SectionCard>
          <SectionCard
            title="Danger zone"
            description="Irreversible actions for this account."
            headerAction={
              <Button variant="destructive" size="sm">
                Delete account
              </Button>
            }
          >
            <p className="text-muted-foreground text-sm">
              Once deleted, your account cannot be recovered.
            </p>
          </SectionCard>
        </div>
      </Story>

      <Story
        title="With form content"
        description="Drop labels and inputs into the body — pairs naturally with form primitives."
      >
        <SectionCard
          title="Personal info"
          description="Used on invoices and team emails."
          headerAction={<Button size="sm">Save</Button>}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sc-name">Full name</Label>
              <Input id="sc-name" placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-email">Email</Label>
              <Input id="sc-email" type="email" placeholder="jane@acme.com" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="sc-bio">Bio</Label>
              <Textarea id="sc-bio" placeholder="A short bio…" rows={3} />
            </div>
          </div>
        </SectionCard>
      </Story>
    </>
  );
}
