import Story from '../../components/story/Story'
import { RoleMatrix, type PermissionGroup, type Role } from '@react-registry-blocks/role-matrix/RoleMatrix'
import * as React from 'react'

const manyRoles: Role[] = [
  { id: 'owner', label: 'Owner' },
  { id: 'admin', label: 'Admin' },
  { id: 'editor', label: 'Editor' },
  { id: 'analyst', label: 'Analyst' },
  { id: 'viewer', label: 'Viewer' },
]

const shipmentGroups: PermissionGroup[] = [
  {
    resource: 'Shipments',
    permissions: [
      { id: 'ship.create', label: 'Book shipments' },
      { id: 'ship.read', label: 'Track shipments' },
    ],
  },
  {
    resource: 'Invoices',
    permissions: [{ id: 'inv.pay', label: 'Pay invoices' }],
  },
]

function Controlled() {
  const [grants, setGrants] = React.useState<Record<string, string[]>>({
    'users.create': ['admin'],
    'users.read': ['admin', 'editor', 'viewer'],
    'users.update': ['admin', 'editor'],
    'users.delete': [],
    'billing.read': ['admin'],
    'billing.manage': [],
    'content.create': ['admin', 'editor'],
    'content.read': ['admin', 'editor', 'viewer'],
    'content.delete': ['admin'],
  })
  return <RoleMatrix value={grants} onValueChange={setGrants} />
}

export default function RoleMatrixDemo() {
  return (
    <>
      <Story title="Default" description="Three roles, three resource groups, live tri-state column headers.">
        <RoleMatrix />
      </Story>

      <Story title="Controlled" description="value/onValueChange mirror the full grants map as cells toggle.">
        <Controlled />
      </Story>

      <Story title="Read-only" description="readOnly disables every control and shows a badge.">
        <RoleMatrix readOnly />
      </Story>

      <Story title="Many roles" description="Five roles force horizontal scroll inside the card.">
        <RoleMatrix roles={manyRoles} />
      </Story>

      <Story title="Custom groups" description="Swap in your own resources and permissions via props.">
        <RoleMatrix groups={shipmentGroups} />
      </Story>
    </>
  )
}
