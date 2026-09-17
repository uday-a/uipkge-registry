import Story from '../../components/story/Story'
import { InviteMembers, type InviteEntry } from '@react-registry-blocks/invite-members/InviteMembers'

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3_600_000)
const daysAgo = (d: number) => new Date(now - d * 86_400_000)

const mixedInvites: InviteEntry[] = [
  { id: 'mix-1', email: 'ada@lovelace.io', role: 'admin', status: 'accepted', sentAt: daysAgo(30) },
  { id: 'mix-2', email: 'grace@hopper.dev', role: 'editor', status: 'pending', sentAt: hoursAgo(4) },
  { id: 'mix-3', email: 'alan@turing.org', role: 'viewer', status: 'expired', sentAt: daysAgo(21) },
  { id: 'mix-4', email: 'jean@bartik.dev', role: 'editor', status: 'pending', sentAt: hoursAgo(20) },
  { id: 'mix-5', email: 'katherine@johnson.io', role: 'viewer', status: 'accepted', sentAt: daysAgo(9) },
]

const expiredInvites: InviteEntry[] = [
  { id: 'exp-1', email: 'sam@oldteam.com', role: 'editor', status: 'expired', sentAt: daysAgo(30) },
  { id: 'exp-2', email: 'riley@oldteam.com', role: 'viewer', status: 'expired', sentAt: daysAgo(24) },
  { id: 'exp-3', email: 'morgan@oldteam.com', role: 'admin', status: 'expired', sentAt: daysAgo(18) },
  { id: 'exp-4', email: 'casey@newteam.com', role: 'editor', status: 'pending', sentAt: hoursAgo(3) },
]

const resendInvites: InviteEntry[] = [
  { id: 'rs-1', email: 'taylor@acme.com', role: 'viewer', status: 'pending', sentAt: hoursAgo(2) },
  { id: 'rs-2', email: 'jordan@acme.com', role: 'editor', status: 'pending', sentAt: daysAgo(6) },
  { id: 'rs-3', email: 'drew@acme.com', role: 'viewer', status: 'expired', sentAt: daysAgo(15) },
]

const roleInvites: InviteEntry[] = [
  { id: 'role-1', email: 'nia@admin.io', role: 'admin', status: 'accepted', sentAt: daysAgo(12) },
  { id: 'role-2', email: 'leo@editor.io', role: 'editor', status: 'pending', sentAt: hoursAgo(5) },
  { id: 'role-3', email: 'ivy@viewer.io', role: 'viewer', status: 'pending', sentAt: hoursAgo(1) },
]

const manyInvites: InviteEntry[] = [
  { id: 'many-1', email: 'opal@northwind.co', role: 'admin', status: 'accepted', sentAt: daysAgo(45) },
  { id: 'many-2', email: 'felix@northwind.co', role: 'editor', status: 'accepted', sentAt: daysAgo(31) },
  { id: 'many-3', email: 'maya@northwind.co', role: 'editor', status: 'pending', sentAt: hoursAgo(3) },
  { id: 'many-4', email: 'theo@northwind.co', role: 'viewer', status: 'pending', sentAt: hoursAgo(7) },
  { id: 'many-5', email: 'iris@northwind.co', role: 'admin', status: 'pending', sentAt: daysAgo(1) },
  { id: 'many-6', email: 'hugo@northwind.co', role: 'viewer', status: 'expired', sentAt: daysAgo(19) },
  { id: 'many-7', email: 'wren@northwind.co', role: 'editor', status: 'expired', sentAt: daysAgo(26) },
  { id: 'many-8', email: 'nils@northwind.co', role: 'viewer', status: 'accepted', sentAt: daysAgo(14) },
  { id: 'many-9', email: 'sade@northwind.co', role: 'editor', status: 'pending', sentAt: hoursAgo(30) },
]

export default function InviteMembersDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Stub data at 18 of 20 seats — counter tints warning at ≥90% capacity. Fully interactive."
      >
        <InviteMembers />
      </Story>

      <Story title="Empty" description="No invites yet — dashed empty state, compose stays usable.">
        <InviteMembers initialInvites={[]} />
      </Story>

      <Story
        title="Mixed statuses"
        description="Pending, accepted and expired invites side by side with their badge treatments."
      >
        <InviteMembers initialInvites={mixedInvites} memberSeats={10} />
      </Story>

      <Story
        title="Expired emphasis"
        description="Three lapsed invites with old timestamps; each keeps its Resend action to re-activate the invite."
      >
        <InviteMembers initialInvites={expiredInvites} memberSeats={12} />
      </Story>

      <Story
        title="Resend flow visible"
        description="Pending and expired rows expose Resend — it refreshes the stamp and revives expired invites."
      >
        <InviteMembers initialInvites={resendInvites} memberSeats={11} />
      </Story>

      <Story
        title="Invalid email error shown"
        description="An invalid draft surfaces the destructive border and error text under the input."
      >
        <InviteMembers initialDraft="priya#acme.com" memberSeats={8} />
      </Story>

      <Story
        title="Bulk paste result"
        description="A comma/space-separated paste queues valid addresses as chips — pick a role, then send them all."
      >
        <InviteMembers initialQueue={['jane@acme.com', 'omar@acme.com', 'kim@acme.com']} memberSeats={9} />
      </Story>

      <Story
        title="Role assignment variety"
        description="Admin, Editor and Viewer badges in one list; the Select sets the role for the next send."
      >
        <InviteMembers initialInvites={roleInvites} memberSeats={13} />
      </Story>

      <Story
        title="Seat-limit warning"
        description="19 of 20 seats used — past the ≥90% threshold the header counter switches to its warning tint."
      >
        <InviteMembers memberSeats={17} />
      </Story>

      <Story
        title="Many invites"
        description="Nine rows across every status and role — the divide-y list stays readable at density."
      >
        <InviteMembers initialInvites={manyInvites} memberSeats={14} />
      </Story>
    </>
  )
}
