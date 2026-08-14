import Story from '../../components/story/Story'
import { NotificationsPopover } from '@react-registry-blocks/notifications-popover/NotificationsPopover'
import { Button } from '@react-registry/button'
import { Bell } from 'lucide-react'
// Render-prop trigger: consumers supply their own Bell button. The
// `trigger` prop receives the live `unreadCount` so it can show a badge.

export default function NotificationsPopoverDemo() {
  return (
    <Story
      title="Notifications Popover"
      description="Header-grade notifications panel. Filter tabs (All/Unread), Today/Earlier groups, category-coloured accent bars, hover-dismiss, mark-all-read, slide-in animation. Wrap your own trigger button — the `trigger` prop exposes `unreadCount` for the badge."
    >
      <NotificationsPopover
        trigger={({ unreadCount }) => (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground relative size-9 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="bg-primary ring-background absolute top-1.5 right-1.5 size-2 rounded-full ring-2" />
            )}
          </Button>
        )}
      />
    </Story>
  )
}
