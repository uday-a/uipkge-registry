import { useState } from 'react'
import Story from '../../components/story/Story'
import { Badge } from '@react-registry/badge'
import { Button } from '@react-registry/button'
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
} from '@react-registry/dialog'
import { Input } from '@react-registry/input'
import { Label } from '@react-registry/label'
import { Switch } from '@react-registry/switch'
import { Textarea } from '@react-registry/textarea'
import { CreditCard, GitBranch, Globe, Image, Link2, Lock, Sparkles, Users } from 'lucide-react'

export default function DialogDemo() {
  const [shareUrl, setShareUrl] = useState('https://uipkge.dev/r/vue/button.json')
  const [copied, setCopied] = useState(false)
  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard blocked */
    }
  }

  const [newProjectOpen, setNewProjectOpen] = useState(false)
  function createProject() {
    setNewProjectOpen(false)
  }

  return (
    <>
      <Story
        title="Form dialog"
        description="Most common pattern — inputs inside DialogContent with a save action in the footer."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Make changes to your profile and save.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="dlg-name">Name</Label>
                <Input id="dlg-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dlg-username">Username</Label>
                <Input id="dlg-username" defaultValue="@peduarte" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dlg-bio">Bio</Label>
                <Textarea id="dlg-bio" defaultValue="Open-source UI for Vue & Nuxt." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
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
          <DialogTrigger asChild>
            <Button variant="outline">
              <Link2 className="size-4" />
              Share link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share registry item</DialogTitle>
              <DialogDescription>Anyone with this link can install the component.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Input value={shareUrl} onChange={(e) => setShareUrl(e.target.value)} readOnly />
              <Button size="sm" onClick={copyShare}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
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
        <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
          <DialogTrigger asChild>
            <Button>Create project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New project</DialogTitle>
              <DialogDescription>
                Spin up a fresh project with sensible defaults. You can change everything later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="proj-name">Project name</Label>
                <Input id="proj-name" placeholder="acme-dashboard" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proj-org">Organization</Label>
                <Input id="proj-org" defaultValue="Acme Inc" disabled />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="proj-region">Region</Label>
                  <Input id="proj-region" defaultValue="us-east-1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="proj-tier">Tier</Label>
                  <Input id="proj-tier" defaultValue="Starter" />
                </div>
              </div>
              <div className="bg-muted/30 flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="text-muted-foreground size-4" />
                  Private repository
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={createProject}>Create project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Story>

      <Story
        title="Onboarding card"
        description="Hero-style dialog with an icon ring, single CTA, and footer-less layout for one-action prompts."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Sparkles className="size-4" />
              Show what's new
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="items-center text-center">
              <div className="bg-primary/10 text-primary mb-2 flex size-12 items-center justify-center rounded-full">
                <Sparkles className="size-6" />
              </div>
              <DialogTitle>v2 is live</DialogTitle>
              <DialogDescription>
                Theme tokens, vertical tabs, and a brand-new timeline. Check the changelog for the full list.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <DialogClose asChild>
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
          <DialogTrigger asChild>
            <Button variant="outline">
              <CreditCard className="size-4" />
              Upgrade plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Choose a plan</DialogTitle>
              <DialogDescription>Cancel anytime. All plans include unlimited components.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1 rounded-lg border p-4">
                <p className="font-medium">Free</p>
                <p className="text-2xl font-semibold">$0</p>
                <p className="text-muted-foreground text-xs">Solo · 1 project</p>
              </div>
              <div className="border-primary relative space-y-1 rounded-lg border-2 p-4">
                <Badge variant="info" className="absolute top-3 right-3">
                  Recommended
                </Badge>
                <p className="font-medium">Pro</p>
                <p className="text-2xl font-semibold">$12</p>
                <p className="text-muted-foreground text-xs">Per editor · unlimited projects</p>
              </div>
              <div className="space-y-1 rounded-lg border p-4">
                <p className="font-medium">Team</p>
                <p className="text-2xl font-semibold">$24</p>
                <p className="text-muted-foreground text-xs">SSO · audit logs · priority support</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
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
          <DialogTrigger asChild>
            <Button variant="outline">
              <Globe className="size-4" />
              Connect service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect a service</DialogTitle>
              <DialogDescription>Pick where to mirror your registry events.</DialogDescription>
            </DialogHeader>
            <div className="space-y-1">
              <DialogClose asChild>
                <button className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors">
                  <GitBranch className="text-muted-foreground size-5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">GitHub</p>
                    <p className="text-muted-foreground text-xs">Push registry updates as commits.</p>
                  </div>
                </button>
              </DialogClose>
              <DialogClose asChild>
                <button className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors">
                  <Image className="text-muted-foreground size-5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Figma</p>
                    <p className="text-muted-foreground text-xs">Mirror tokens to a Figma library.</p>
                  </div>
                </button>
              </DialogClose>
              <DialogClose asChild>
                <button className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors">
                  <Users className="text-muted-foreground size-5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Slack</p>
                    <p className="text-muted-foreground text-xs">Post component changes to a channel.</p>
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
          <DialogTrigger asChild>
            <Button variant="outline">View terms</Button>
          </DialogTrigger>
          <DialogScrollContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Terms of service</DialogTitle>
              <DialogDescription>Last updated May 2026.</DialogDescription>
            </DialogHeader>
            <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((i) => (
                <p key={i}>
                  §{i} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                  ut aliquip ex ea commodo consequat.
                </p>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Accept &amp; close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogScrollContent>
        </Dialog>
      </Story>
    </>
  )
}
