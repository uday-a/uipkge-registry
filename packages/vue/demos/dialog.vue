<script setup lang="ts">
import { ref } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  GitBranch,
  Globe,
  Image,
  Link2,
  Lock,
  Sparkles,
  Users,
} from "lucide-vue-next";

const shareUrl = ref("https://uipkge.dev/r/vue/button.json");
const copied = ref(false);
async function copyShare() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1400);
  } catch {
    /* clipboard blocked */
  }
}

const newProjectOpen = ref(false);
function createProject() {
  newProjectOpen.value = false;
}
</script>

<template>
  <Story
    title="Form dialog"
    description="Most common pattern — inputs inside DialogContent with a save action in the footer."
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription
            >Make changes to your profile and save.</DialogDescription
          >
        </DialogHeader>
        <div class="grid gap-4 py-2">
          <div class="grid gap-2">
            <Label for="dlg-name">Name</Label>
            <Input id="dlg-name" model-value="Pedro Duarte" />
          </div>
          <div class="grid gap-2">
            <Label for="dlg-username">Username</Label>
            <Input id="dlg-username" model-value="@peduarte" />
          </div>
          <div class="grid gap-2">
            <Label for="dlg-bio">Bio</Label>
            <Textarea
              id="dlg-bio"
              model-value="Open-source UI for Vue & Nuxt."
              :rows="3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Story>

  <Story
    title="Share link"
    description="Single-input dialog for sharing a URL. The trigger sits inline next to a label."
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">
          <Link2 class="size-4" />
          Share link
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share registry item</DialogTitle>
          <DialogDescription
            >Anyone with this link can install the component.</DialogDescription
          >
        </DialogHeader>
        <div class="flex items-center gap-2">
          <Input v-model="shareUrl" readonly />
          <Button size="sm" @click="copyShare">{{
            copied ? "Copied" : "Copy"
          }}</Button>
        </div>
        <DialogFooter class="sm:justify-start">
          <DialogClose as-child>
            <Button variant="ghost">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Story>

  <Story
    title="New project — multi-section form"
    description="Bigger dialog with a header card, a body grid of fields, and a typed v-model:open binding for programmatic close."
  >
    <Dialog v-model:open="newProjectOpen">
      <DialogTrigger as-child>
        <Button>Create project</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Spin up a fresh project with sensible defaults. You can change
            everything later.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="proj-name">Project name</Label>
            <Input id="proj-name" placeholder="acme-dashboard" />
          </div>
          <div class="grid gap-2">
            <Label for="proj-org">Organization</Label>
            <Input id="proj-org" model-value="Acme Inc" disabled />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-2">
              <Label for="proj-region">Region</Label>
              <Input id="proj-region" model-value="us-east-1" />
            </div>
            <div class="grid gap-2">
              <Label for="proj-tier">Tier</Label>
              <Input id="proj-tier" model-value="Starter" />
            </div>
          </div>
          <div
            class="bg-muted/30 flex items-center justify-between rounded-md border px-3 py-2 text-sm"
          >
            <div class="flex items-center gap-2">
              <Lock class="text-muted-foreground size-4" />
              Private repository
            </div>
            <Switch :model-value="true" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button @click="createProject">Create project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Story>

  <Story
    title="Onboarding card"
    description="Hero-style dialog with an icon ring, single CTA, and footer-less layout for one-action prompts."
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">
          <Sparkles class="size-4" />
          Show what's new
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader class="items-center text-center">
          <div
            class="bg-primary/10 text-primary mb-2 flex size-12 items-center justify-center rounded-full"
          >
            <Sparkles class="size-6" />
          </div>
          <DialogTitle>v2 is live</DialogTitle>
          <DialogDescription>
            Theme tokens, vertical tabs, and a brand-new timeline. Check the
            changelog for the full list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="sm:justify-center">
          <DialogClose as-child>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Story>

  <Story
    title="Pricing comparison"
    description="Wider dialog with a 3-up grid — works as a quick upgrade prompt without leaving the page."
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">
          <CreditCard class="size-4" />
          Upgrade plan
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a plan</DialogTitle>
          <DialogDescription
            >Cancel anytime. All plans include unlimited
            components.</DialogDescription
          >
        </DialogHeader>
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="space-y-1 rounded-lg border p-4">
            <p class="font-medium">Free</p>
            <p class="text-2xl font-semibold">$0</p>
            <p class="text-muted-foreground text-xs">Solo · 1 project</p>
          </div>
          <div
            class="border-primary relative space-y-1 rounded-lg border-2 p-4"
          >
            <Badge variant="info" class="absolute top-3 right-3"
              >Recommended</Badge
            >
            <p class="font-medium">Pro</p>
            <p class="text-2xl font-semibold">$12</p>
            <p class="text-muted-foreground text-xs">
              Per editor · unlimited projects
            </p>
          </div>
          <div class="space-y-1 rounded-lg border p-4">
            <p class="font-medium">Team</p>
            <p class="text-2xl font-semibold">$24</p>
            <p class="text-muted-foreground text-xs">
              SSO · audit logs · priority support
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Maybe later</Button>
          </DialogClose>
          <Button>Continue with Pro</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Story>

  <Story
    title="Connect integrations"
    description="List of external services as pickable rows. Closes-on-select pattern via DialogClose around each row."
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">
          <Globe class="size-4" />
          Connect service
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect a service</DialogTitle>
          <DialogDescription
            >Pick where to mirror your registry events.</DialogDescription
          >
        </DialogHeader>
        <div class="space-y-1">
          <DialogClose as-child>
            <button
              class="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors"
            >
              <GitBranch class="text-muted-foreground size-5" />
              <div class="flex-1">
                <p class="text-sm font-medium">GitHub</p>
                <p class="text-muted-foreground text-xs">
                  Push registry updates as commits.
                </p>
              </div>
            </button>
          </DialogClose>
          <DialogClose as-child>
            <button
              class="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors"
            >
              <Image class="text-muted-foreground size-5" />
              <div class="flex-1">
                <p class="text-sm font-medium">Figma</p>
                <p class="text-muted-foreground text-xs">
                  Mirror tokens to a Figma library.
                </p>
              </div>
            </button>
          </DialogClose>
          <DialogClose as-child>
            <button
              class="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors"
            >
              <Users class="text-muted-foreground size-5" />
              <div class="flex-1">
                <p class="text-sm font-medium">Slack</p>
                <p class="text-muted-foreground text-xs">
                  Post component changes to a channel.
                </p>
              </div>
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  </Story>

  <Story
    title="Long content with scroll"
    description="DialogContent grows with its content; combine with DialogScrollContent for very long bodies — the scroll lives inside the dialog, not the page."
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">View terms</Button>
      </DialogTrigger>
      <DialogScrollContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Last updated May 2026.</DialogDescription>
        </DialogHeader>
        <div class="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p v-for="i in 8" :key="i">
            §{{ i }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button>Accept &amp; close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Story>
</template>
