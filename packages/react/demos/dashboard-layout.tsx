import Story from '../../components/story/Story'
import { DashboardLayout } from '@react-registry-blocks/dashboard-layout/DashboardLayout'

const breadcrumbs = [{ label: 'Dashboard', href: '#' }, { label: 'Overview' }]

export default function DashboardLayoutDemo() {
  return (
    <Story
      title="Dashboard Layout"
      description="Full dashboard shell: collapsible sidebar-02 + sticky topbar (sidebar trigger, breadcrumb, command palette, theme switch, notifications) + main content slot. Auto-pulls every transitive piece (sidebar-02, command-palette, notifications-popover, profile-menu, theme-switch)."
    >
      <div
        className="bg-background relative h-[640px] overflow-hidden rounded-lg border [&_.min-h-svh]:!min-h-0 [&_[data-slot=sidebar-wrapper]]:!min-h-0"
        style={{ transform: 'translateZ(0)' }}
      >
        <DashboardLayout breadcrumbs={breadcrumbs}>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-muted-foreground text-sm">Your main page content slots in here.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-card rounded-lg border p-4">
                <p className="text-muted-foreground text-xs">Revenue</p>
                <p className="text-2xl font-semibold">$48,210</p>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="text-muted-foreground text-xs">Active users</p>
                <p className="text-2xl font-semibold">2,140</p>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="text-muted-foreground text-xs">Conversion</p>
                <p className="text-2xl font-semibold">3.8%</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>
    </Story>
  )
}
