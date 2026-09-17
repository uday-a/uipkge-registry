import Story from '../../components/story/Story'
import {
  NotificationCenter,
  type NotificationCenterItem,
} from '@react-registry-blocks/notification-center/NotificationCenter'

const manyItems: NotificationCenterItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `m${i}`,
  category: (['mention', 'comment', 'system', 'security'] as const)[i % 4],
  title: `Notification ${i + 1}`,
  body: 'Preview line for a longer body that truncates cleanly.',
  date: new Date(Date.now() - i * 10_800_000),
  read: i % 3 !== 0,
}))

export default function NotificationCenterDemo() {
  return (
    <>
      <Story title="Default" description="Mixed categories with unread badges, day grouping and hover actions.">
        <NotificationCenter />
      </Story>

      <Story title="All read" description="No unread dot, badge hidden, mark-all-read disabled.">
        <NotificationCenter
          notifications={[
            {
              id: 'r1',
              category: 'system',
              title: 'Weekly digest ready',
              body: 'Your workspace summary for last week.',
              date: new Date(),
              read: true,
            },
            {
              id: 'r2',
              category: 'comment',
              title: 'Jonas commented',
              body: 'Shipped the fix — closing the ticket.',
              date: new Date(Date.now() - 86_400_000),
              read: true,
            },
          ]}
        />
      </Story>

      <Story title="Mentions filter" description="The Mentions tab only shows mention-category rows.">
        <div>
          <p className="text-muted-foreground mb-2 text-xs">Click the Mentions tab to see the filter in action.</p>
          <NotificationCenter />
        </div>
      </Story>

      <Story title="Empty inbox" description="All-tab empty state with a muted icon.">
        <NotificationCenter notifications={[]} />
      </Story>

      <Story title="Empty unread" description="Unread tab after clearing everything.">
        <div>
          <p className="text-muted-foreground mb-2 text-xs">Switch to the Unread tab — every row is already read.</p>
          <NotificationCenter
            notifications={[
              {
                id: 'e1',
                category: 'comment',
                title: 'Priya commented',
                body: 'Looks good to me.',
                date: new Date(),
                read: true,
              },
            ]}
          />
        </div>
      </Story>

      <Story title="Security alerts" description="Warning-tinted tiles draw the eye to security events.">
        <NotificationCenter
          notifications={[
            {
              id: 's1',
              category: 'security',
              title: 'New sign-in from Berlin',
              body: 'Chrome on macOS · 84.190.201.3',
              date: new Date(),
              read: false,
            },
            {
              id: 's2',
              category: 'security',
              title: 'API key rotated',
              body: 'uipkge_live_…4f2a was rotated automatically.',
              date: new Date(Date.now() - 7_200_000),
              read: false,
            },
          ]}
        />
      </Story>

      <Story title="Many rows" description="Twelve items keep their grouping and stay scannable.">
        <NotificationCenter notifications={manyItems} />
      </Story>

      <Story title="Compact width" description="Phone-width layout; rows wrap gracefully.">
        <div className="max-w-sm">
          <NotificationCenter />
        </div>
      </Story>
    </>
  )
}
