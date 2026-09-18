import Story from '../../components/story/Story'
import {
  List,
  ListItem,
  ListItemActions,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListSubheader,
} from '@react-registry/list'
import { Badge } from '@react-registry/badge'
import { Button } from '@react-registry/button'
import { Bell, ChevronRight, CreditCard, ExternalLink, Lock, Sparkles, User } from 'lucide-react'

const settings = [
  { id: 1, label: 'Profile', desc: 'Public profile and settings', icon: User },
  { id: 2, label: 'Notifications', desc: 'Email and push preferences', icon: Bell },
  { id: 3, label: 'Billing', desc: 'Plan, payment, invoices', icon: CreditCard },
  { id: 4, label: 'Security', desc: '2FA, sessions, audit log', icon: Lock },
]

const docs = [
  { label: 'Getting started', href: '#' },
  { label: 'Components', href: '#' },
  { label: 'Theming', href: '#' },
  { label: 'CLI reference', href: '#' },
]

export default function ListDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Vertical list with two-line items and a trailing chevron, suitable for settings menus."
      >
        <List className="max-w-md">
          {settings.map((i) => {
            const Icon = i.icon
            return (
              <ListItem key={i.id} className="flex items-center gap-3">
                <Icon className="text-muted-foreground size-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{i.label}</p>
                  <p className="text-muted-foreground text-xs">{i.desc}</p>
                </div>
                <ChevronRight className="text-muted-foreground size-4" />
              </ListItem>
            )
          })}
        </List>
      </Story>

      <Story
        title="With subheaders"
        description="ListSubheader groups items into labeled sections inside a single list."
      >
        <List className="max-w-md">
          <ListSubheader>Account</ListSubheader>
          <ListItem className="flex items-center gap-2">
            <User className="text-muted-foreground size-4" />
            Profile
          </ListItem>
          <ListItem className="flex items-center gap-2">
            <Lock className="text-muted-foreground size-4" />
            Security
          </ListItem>
          <ListSubheader>Workspace</ListSubheader>
          <ListItem className="flex items-center gap-2">
            <Bell className="text-muted-foreground size-4" />
            Notifications
          </ListItem>
          <ListItem className="flex items-center gap-2">
            <CreditCard className="text-muted-foreground size-4" />
            Billing
          </ListItem>
        </List>
      </Story>

      <Story title="Active state" description="Set active on a ListItem to highlight the current selection.">
        <List className="max-w-md">
          <ListItem>Inbox</ListItem>
          <ListItem active>Drafts</ListItem>
          <ListItem>Sent</ListItem>
          <ListItem>Archive</ListItem>
          <ListItem>Trash</ListItem>
        </List>
      </Story>

      <Story title="Disabled state" description="Disabled items are dimmed and ignore pointer events.">
        <List className="max-w-md">
          <ListItem>Available</ListItem>
          <ListItem disabled>Unavailable (disabled)</ListItem>
          <ListItem>Available</ListItem>
          <ListItem disabled>Coming soon</ListItem>
        </List>
      </Story>

      <Story title="Anchor links" description="Render items as anchors by setting the as prop on List and ListItem.">
        <List as="ul" className="max-w-md">
          {docs.map((d) => (
            <ListItem key={d.label} as="a" href={d.href} className="flex items-center justify-between">
              <span className="text-sm">{d.label}</span>
              <ExternalLink className="text-muted-foreground size-3.5" />
            </ListItem>
          ))}
        </List>
      </Story>

      <Story
        title="Structured Item Rows"
        description="Compound ListItemMedia, ListItemContent, and ListItemActions for settings and rich list feeds."
      >
        <List className="max-w-md space-y-1">
          <ListItem className="border-border hover:bg-muted/40 rounded-lg border p-2.5">
            <ListItemMedia>
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                <Sparkles className="size-4" />
              </div>
            </ListItemMedia>
            <ListItemContent>
              <ListItemTitle>AI Copilot Assistant</ListItemTitle>
              <ListItemDescription>Automatic smart recommendations & summaries</ListItemDescription>
            </ListItemContent>
            <ListItemActions>
              <Badge variant="secondary">Pro</Badge>
              <Button size="xs" variant="outline">
                Configure
              </Button>
            </ListItemActions>
          </ListItem>

          <ListItem className="border-border hover:bg-muted/40 rounded-lg border p-2.5">
            <ListItemMedia>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
                <Lock className="size-4" />
              </div>
            </ListItemMedia>
            <ListItemContent>
              <ListItemTitle>Two-Factor Authentication</ListItemTitle>
              <ListItemDescription>Enabled via authenticator app</ListItemDescription>
            </ListItemContent>
            <ListItemActions>
              <Badge variant="outline" className="text-success border-success/30">
                Active
              </Badge>
            </ListItemActions>
          </ListItem>
        </List>
      </Story>
    </>
  )
}
