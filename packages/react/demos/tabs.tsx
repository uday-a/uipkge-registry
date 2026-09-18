import Story from '../../components/story/Story'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@react-registry/tabs'
import { Activity, BarChart3, Bell, CreditCard, Globe, Lock, Mail, Settings, Shield, User, Users } from 'lucide-react'

export default function TabsDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Three triggers in a segmented TabsList; each TabsContent shows when its value matches."
      >
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <p className="p-3 text-sm">Tabs let users switch between related sections without navigation.</p>
          </TabsContent>
          <TabsContent value="password">
            <p className="text-muted-foreground p-3 text-sm">Password fields go here.</p>
          </TabsContent>
          <TabsContent value="team">
            <p className="text-muted-foreground p-3 text-sm">Team management UI goes here.</p>
          </TabsContent>
        </Tabs>
      </Story>

      <Story
        title="Overflow scroll"
        description="When triggers exceed the list width it scrolls horizontally (scrollbar hidden). Centering degrades to start alignment and the sliding indicator tracks the active trigger."
      >
        <Tabs defaultValue="overview" className="max-w-sm">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="observability">Observability</TabsTrigger>
            <TabsTrigger value="access-control">Access control</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="p-3 text-sm">Scroll the tab row — every trigger stays reachable.</p>
          </TabsContent>
          <TabsContent value="billing">
            <p className="text-muted-foreground p-3 text-sm">Billing settings go here.</p>
          </TabsContent>
        </Tabs>
      </Story>

      <Story
        title="Vertical orientation"
        description="orientation='vertical' rotates the layout — TabsList becomes a left rail and content fills the rest."
      >
        <Tabs defaultValue="profile" orientation="vertical" className="max-w-xl">
          <TabsList className="w-48 shrink-0">
            <TabsTrigger value="profile">
              {' '}
              <User className="size-4" /> Profile{' '}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              {' '}
              <Bell className="size-4" /> Notifications{' '}
            </TabsTrigger>
            <TabsTrigger value="security">
              {' '}
              <Shield className="size-4" /> Security{' '}
            </TabsTrigger>
            <TabsTrigger value="billing">
              {' '}
              <CreditCard className="size-4" /> Billing{' '}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <p className="text-sm">Update your profile information and avatar.</p>
          </TabsContent>
          <TabsContent value="notifications">
            <p className="text-sm">Manage email and push notification preferences.</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="text-sm">Configure two-factor authentication and active sessions.</p>
          </TabsContent>
          <TabsContent value="billing">
            <p className="text-sm">View invoices and update your payment method.</p>
          </TabsContent>
        </Tabs>
      </Story>

      <Story
        title="Underline variant"
        description="variant='underline' on TabsList renders a bottom-border bar with an underline indicator on the active trigger."
      >
        <Tabs defaultValue="overview" className="max-w-xl">
          <TabsList variant="underline">
            <TabsTrigger value="overview" variant="underline">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" variant="underline">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" variant="underline">
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" variant="underline">
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-muted-foreground p-3 text-sm">Overview content.</p>
          </TabsContent>
          <TabsContent value="analytics">
            <p className="text-muted-foreground p-3 text-sm">Analytics content.</p>
          </TabsContent>
          <TabsContent value="reports">
            <p className="text-muted-foreground p-3 text-sm">Reports content.</p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-muted-foreground p-3 text-sm">Settings content.</p>
          </TabsContent>
        </Tabs>
      </Story>

      <Story
        title="Pill variant"
        description="variant='pill' gives a rounded-full pill style with no background track."
      >
        <Tabs defaultValue="day" className="max-w-md">
          <TabsList variant="pill">
            <TabsTrigger value="day" variant="pill">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" variant="pill">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" variant="pill">
              Month
            </TabsTrigger>
            <TabsTrigger value="year" variant="pill">
              Year
            </TabsTrigger>
          </TabsList>
          <TabsContent value="day">
            <p className="text-muted-foreground p-3 text-sm">Daily breakdown.</p>
          </TabsContent>
          <TabsContent value="week">
            <p className="text-muted-foreground p-3 text-sm">Weekly trends.</p>
          </TabsContent>
          <TabsContent value="month">
            <p className="text-muted-foreground p-3 text-sm">Monthly summary.</p>
          </TabsContent>
          <TabsContent value="year">
            <p className="text-muted-foreground p-3 text-sm">Yearly review.</p>
          </TabsContent>
        </Tabs>
      </Story>

      <Story
        title="With disabled tab"
        description="A TabsTrigger with disabled is unclickable and renders at 50% opacity."
      >
        <Tabs defaultValue="overview" className="max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports (pro)
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-muted-foreground p-3 text-sm">Overview content.</p>
          </TabsContent>
          <TabsContent value="analytics">
            <p className="text-muted-foreground p-3 text-sm">Analytics content.</p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-muted-foreground p-3 text-sm">Settings content.</p>
          </TabsContent>
        </Tabs>
      </Story>

      <Story
        title="Many tabs (overflow)"
        description="Wrap TabsList in a horizontal-scroll container to handle long trigger lists gracefully."
      >
        <Tabs defaultValue="general" className="w-full max-w-2xl">
          <div className="overflow-x-auto">
            <TabsList className="w-max">
              <TabsTrigger value="general">
                <Settings className="size-4" /> General
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="size-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="size-4" /> Security
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="size-4" /> Email
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="size-4" /> Billing
              </TabsTrigger>
              <TabsTrigger value="locale">
                <Globe className="size-4" /> Locale
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <BarChart3 className="size-4" /> Metrics
              </TabsTrigger>
              <TabsTrigger value="audit">
                <Activity className="size-4" /> Audit
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="general">
            <p className="text-muted-foreground p-3 text-sm">General settings.</p>
          </TabsContent>
          <TabsContent value="users">
            <p className="text-muted-foreground p-3 text-sm">User management.</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="text-muted-foreground p-3 text-sm">Security policies.</p>
          </TabsContent>
          <TabsContent value="email">
            <p className="text-muted-foreground p-3 text-sm">Email configuration.</p>
          </TabsContent>
          <TabsContent value="billing">
            <p className="text-muted-foreground p-3 text-sm">Billing details.</p>
          </TabsContent>
          <TabsContent value="locale">
            <p className="text-muted-foreground p-3 text-sm">Locale and timezone.</p>
          </TabsContent>
          <TabsContent value="metrics">
            <p className="text-muted-foreground p-3 text-sm">Metrics dashboard.</p>
          </TabsContent>
          <TabsContent value="audit">
            <p className="text-muted-foreground p-3 text-sm">Audit log.</p>
          </TabsContent>
        </Tabs>
      </Story>

      <Story
        title="Card-wrapped content"
        description="Each TabsContent renders a Card so the panel reads as a self-contained surface."
      >
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Make changes to your account here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Tabs let users switch between related sections without navigation.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Password fields go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>Manage your team.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Team management UI goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Story>
    </>
  )
}
