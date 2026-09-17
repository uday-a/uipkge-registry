<script setup lang="ts">
import {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsSection,
  VerticalTabsTrigger,
} from "@/components/ui/vertical-tabs";
import { ref } from "vue";
import {
  AlertTriangle,
  Bell,
  GitBranch,
  Key,
  Mail,
  RefreshCw,
  Settings,
  Shield,
  User,
} from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Settings-with-forms demo state. Mock save handler so the demo emits
// to the console rather than hitting a backend.
const profile = ref({
  name: "Alex Morgan",
  email: "alex@example.com",
  bio: "Frontend engineer working on dashboards and design systems.",
});
const security = ref({
  twoFactor: true,
  sessionTimeout: "30",
});
const notifications = ref({
  productUpdates: true,
  weeklyDigest: false,
  securityAlerts: true,
});
function onSave(section: string) {
  // eslint-disable-next-line no-console
  console.log(`saved ${section}`, {
    profile: profile.value,
    security: security.value,
    notifications: notifications.value,
  });
}
</script>

<template>
  <Story
    title="With forms (settings page)"
    description="Canonical settings-page pattern: left rail with Profile / Security / Notifications, right pane holds the form for the active section. Each panel composes Input + Label + Textarea + Switch + Save button. Bind your own v-models and submit handler."
  >
    <div class="bg-card rounded-lg border p-6">
      <VerticalTabs default-value="profile">
        <VerticalTabsList>
          <VerticalTabsTrigger value="profile">
            <User />
            Profile
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="security">
            <Shield />
            Security
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="notifications">
            <Bell />
            Notifications
          </VerticalTabsTrigger>
        </VerticalTabsList>

        <VerticalTabsContent value="profile">
          <form class="space-y-5" @submit.prevent="onSave('profile')">
            <div>
              <h3 class="text-lg font-semibold">Profile</h3>
              <p class="text-muted-foreground mt-0.5 text-sm">
                How your account appears to teammates.
              </p>
            </div>
            <Separator />
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="grid gap-1.5">
                <Label for="settings-name">Full name</Label>
                <Input id="settings-name" v-model="profile.name" />
              </div>
              <div class="grid gap-1.5">
                <Label for="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  v-model="profile.email"
                  type="email"
                  :prefix-icon="Mail"
                />
              </div>
            </div>
            <div class="grid gap-1.5">
              <Label for="settings-bio">Bio</Label>
              <Textarea id="settings-bio" v-model="profile.bio" :rows="3" />
              <p class="text-muted-foreground text-xs">
                Markdown supported. Shows on your public profile.
              </p>
            </div>
            <div class="flex justify-end gap-2">
              <Button type="button" variant="ghost">Cancel</Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </VerticalTabsContent>

        <VerticalTabsContent value="security">
          <form class="space-y-5" @submit.prevent="onSave('security')">
            <div>
              <h3 class="text-lg font-semibold">Security</h3>
              <p class="text-muted-foreground mt-0.5 text-sm">
                Sign-in protection and session lifetime.
              </p>
            </div>
            <Separator />
            <div class="flex items-center justify-between gap-4">
              <div class="space-y-0.5">
                <Label class="font-medium">Two-factor authentication</Label>
                <p class="text-muted-foreground text-xs">
                  Require a one-time code on every new device.
                </p>
              </div>
              <Switch v-model="security.twoFactor" />
            </div>
            <div class="grid gap-1.5">
              <Label for="settings-timeout">Session timeout (minutes)</Label>
              <Input
                id="settings-timeout"
                v-model="security.sessionTimeout"
                type="number"
                min="5"
                max="240"
              />
            </div>
            <div class="flex justify-end gap-2">
              <Button type="button" variant="ghost">Cancel</Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </VerticalTabsContent>

        <VerticalTabsContent value="notifications">
          <form class="space-y-5" @submit.prevent="onSave('notifications')">
            <div>
              <h3 class="text-lg font-semibold">Notifications</h3>
              <p class="text-muted-foreground mt-0.5 text-sm">
                Which emails we send to
                <span class="text-foreground font-medium">{{
                  profile.email
                }}</span
                >.
              </p>
            </div>
            <Separator />
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <Label class="font-medium">Product updates</Label>
                  <p class="text-muted-foreground text-xs">
                    Feature releases, breaking changes, deprecations.
                  </p>
                </div>
                <Switch v-model="notifications.productUpdates" />
              </div>
              <div class="flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <Label class="font-medium">Weekly digest</Label>
                  <p class="text-muted-foreground text-xs">
                    Activity summary every Monday morning.
                  </p>
                </div>
                <Switch v-model="notifications.weeklyDigest" />
              </div>
              <div class="flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <Label class="font-medium">Security alerts</Label>
                  <p class="text-muted-foreground text-xs">
                    New sign-ins, password changes. We recommend keeping these
                    on.
                  </p>
                </div>
                <Switch v-model="notifications.securityAlerts" />
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <Button type="button" variant="ghost">Cancel</Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </VerticalTabsContent>
      </VerticalTabs>
    </div>
  </Story>

  <Story
    title="Default"
    description="Settings-style left rail with section labels and icon-prefixed items."
  >
    <div class="bg-card rounded-lg border p-6">
      <VerticalTabs default-value="general">
        <VerticalTabsList>
          <VerticalTabsSection label="Project" />
          <VerticalTabsTrigger value="general">
            <Settings />
            General
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="sync">
            <RefreshCw />
            Sync
          </VerticalTabsTrigger>
          <VerticalTabsSection label="Integrations" />
          <VerticalTabsTrigger value="git-sync">
            <GitBranch />
            Git Sync
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="api-key">
            <Key />
            API Key
          </VerticalTabsTrigger>
          <VerticalTabsSection label="Danger" />
          <VerticalTabsTrigger
            value="danger"
            class="text-destructive hover:text-destructive"
          >
            <AlertTriangle />
            Danger Zone
          </VerticalTabsTrigger>
        </VerticalTabsList>

        <VerticalTabsContent value="general">
          <h3 class="text-lg font-semibold">General</h3>
          <p class="text-muted-foreground mt-1 text-sm">
            Basic project information and settings.
          </p>
        </VerticalTabsContent>
        <VerticalTabsContent value="sync">
          <h3 class="text-lg font-semibold">Sync</h3>
          <p class="text-muted-foreground mt-1 text-sm">
            Configure scheduled translation sync.
          </p>
        </VerticalTabsContent>
        <VerticalTabsContent value="git-sync">
          <h3 class="text-lg font-semibold">Git Sync</h3>
          <p class="text-muted-foreground mt-1 text-sm">
            Connect your repository for two-way sync.
          </p>
        </VerticalTabsContent>
        <VerticalTabsContent value="api-key">
          <h3 class="text-lg font-semibold">API Key</h3>
          <p class="text-muted-foreground mt-1 text-sm">
            Manage credentials used by your app.
          </p>
        </VerticalTabsContent>
        <VerticalTabsContent value="danger">
          <h3 class="text-destructive text-lg font-semibold">Danger Zone</h3>
          <p class="text-muted-foreground mt-1 text-sm">
            Permanently delete this project.
          </p>
        </VerticalTabsContent>
      </VerticalTabs>
    </div>
  </Story>

  <Story
    title="Without sections"
    description="Drop VerticalTabsSection for a flat list of items."
  >
    <div class="bg-card rounded-lg border p-6">
      <VerticalTabs default-value="profile">
        <VerticalTabsList>
          <VerticalTabsTrigger value="profile">
            <User />
            Profile
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="security">
            <Shield />
            Security
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="notifications">
            <Settings />
            Notifications
          </VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="profile">
          <p class="text-muted-foreground text-sm">Profile preferences.</p>
        </VerticalTabsContent>
        <VerticalTabsContent value="security">
          <p class="text-muted-foreground text-sm">
            Two-factor and password options.
          </p>
        </VerticalTabsContent>
        <VerticalTabsContent value="notifications">
          <p class="text-muted-foreground text-sm">
            Email + in-app notification controls.
          </p>
        </VerticalTabsContent>
      </VerticalTabs>
    </div>
  </Story>

  <Story
    title="Disabled item"
    description="Set disabled on a trigger to prevent selection."
  >
    <div class="bg-card rounded-lg border p-6">
      <VerticalTabs default-value="active">
        <VerticalTabsList>
          <VerticalTabsTrigger value="active">
            <Settings />
            Active option
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="locked" disabled>
            <Shield />
            Locked option
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="other">
            <User />
            Other
          </VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="active">
          <p class="text-muted-foreground text-sm">Selectable.</p>
        </VerticalTabsContent>
        <VerticalTabsContent value="other">
          <p class="text-muted-foreground text-sm">Also selectable.</p>
        </VerticalTabsContent>
      </VerticalTabs>
    </div>
  </Story>

  <Story
    title="Compact (no icons)"
    description="Drop the leading icon for a tighter list."
  >
    <div class="bg-card rounded-lg border p-6">
      <VerticalTabs default-value="overview">
        <VerticalTabsList class="w-44">
          <VerticalTabsTrigger value="overview">Overview</VerticalTabsTrigger>
          <VerticalTabsTrigger value="usage">Usage</VerticalTabsTrigger>
          <VerticalTabsTrigger value="billing">Billing</VerticalTabsTrigger>
          <VerticalTabsTrigger value="invoices">Invoices</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="overview">
          <p class="text-muted-foreground text-sm">Account summary.</p>
        </VerticalTabsContent>
        <VerticalTabsContent value="usage">
          <p class="text-muted-foreground text-sm">Resource usage breakdown.</p>
        </VerticalTabsContent>
        <VerticalTabsContent value="billing">
          <p class="text-muted-foreground text-sm">Plan and payment method.</p>
        </VerticalTabsContent>
        <VerticalTabsContent value="invoices">
          <p class="text-muted-foreground text-sm">Past invoices.</p>
        </VerticalTabsContent>
      </VerticalTabs>
    </div>
  </Story>

  <Story
    title="Static indicator"
    description="Pass animated=false on VerticalTabsList to disable the sliding active surface. Active chrome (muted fill + primary rail) paints on the trigger instead."
  >
    <div class="bg-card rounded-lg border p-6">
      <VerticalTabs default-value="profile">
        <VerticalTabsList :animated="false">
          <VerticalTabsTrigger value="profile">
            <User />
            Profile
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="security">
            <Shield />
            Security
          </VerticalTabsTrigger>
          <VerticalTabsTrigger value="notifications">
            <Bell />
            Notifications
          </VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="profile">
          <p class="text-muted-foreground text-sm">
            Static chrome — no slide between items.
          </p>
        </VerticalTabsContent>
        <VerticalTabsContent value="security">
          <p class="text-muted-foreground text-sm">
            Active styles snap instantly.
          </p>
        </VerticalTabsContent>
        <VerticalTabsContent value="notifications">
          <p class="text-muted-foreground text-sm">
            Useful when motion is undesired.
          </p>
        </VerticalTabsContent>
      </VerticalTabs>
    </div>
  </Story>
</template>
