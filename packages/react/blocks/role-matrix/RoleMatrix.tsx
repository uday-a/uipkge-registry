'use client'

import * as React from 'react'
import { ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionCard } from '@/components/ui/section-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface Role {
  id: string
  label: string
}

export interface Permission {
  id: string
  label: string
}

export interface PermissionGroup {
  resource: string
  permissions: Permission[]
}

export interface RoleMatrixProps {
  roles?: Role[]
  groups?: PermissionGroup[]
  /** permissionId -> array of granted roleIds. */
  value?: Record<string, string[]>
  onValueChange?: (value: Record<string, string[]>) => void
  readOnly?: boolean
  className?: string
}

const defaultRoles: Role[] = [
  { id: 'admin', label: 'Admin' },
  { id: 'editor', label: 'Editor' },
  { id: 'viewer', label: 'Viewer' },
]

const defaultGroups: PermissionGroup[] = [
  {
    resource: 'Users',
    permissions: [
      { id: 'users.create', label: 'Invite members' },
      { id: 'users.read', label: 'View members' },
      { id: 'users.update', label: 'Edit profiles & roles' },
      { id: 'users.delete', label: 'Remove members' },
    ],
  },
  {
    resource: 'Billing',
    permissions: [
      { id: 'billing.read', label: 'View invoices' },
      { id: 'billing.manage', label: 'Change plan & seats' },
    ],
  },
  {
    resource: 'Content',
    permissions: [
      { id: 'content.create', label: 'Create documents' },
      { id: 'content.read', label: 'Read documents' },
      { id: 'content.delete', label: 'Delete documents' },
    ],
  },
]

const defaultGrants: Record<string, string[]> = {
  'users.create': ['admin'],
  'users.read': ['admin', 'editor', 'viewer'],
  'users.update': ['admin'],
  'users.delete': ['admin'],
  'billing.read': ['admin', 'editor'],
  'billing.manage': ['admin'],
  'content.create': ['admin', 'editor'],
  'content.read': ['admin', 'editor', 'viewer'],
  'content.delete': ['admin', 'editor'],
}

export function RoleMatrix({
  roles = defaultRoles,
  groups = defaultGroups,
  value,
  onValueChange,
  readOnly = false,
  className,
}: RoleMatrixProps) {
  // Internal working copy keeps the block self-contained; consumers can pass
  // value/onValueChange to mirror changes out (we never mutate props directly).
  const [internalGrants, setInternalGrants] = React.useState<Record<string, string[]>>(
    value ? { ...value } : { ...defaultGrants },
  )
  const grants = internalGrants
  const allRoleIds = roles.map((r) => r.id)

  function setGrant(permissionId: string, roleIds: string[]) {
    const next = { ...grants, [permissionId]: roleIds }
    setInternalGrants(next)
    onValueChange?.(next)
  }

  function isGranted(permissionId: string, roleId: string) {
    return (grants[permissionId] ?? []).includes(roleId)
  }

  function toggleCell(permissionId: string, roleId: string) {
    if (readOnly) return
    const current = grants[permissionId] ?? []
    setGrant(permissionId, current.includes(roleId) ? current.filter((id) => id !== roleId) : [...current, roleId])
  }

  function roleState(roleId: string): boolean | 'indeterminate' {
    const total = groups.reduce((n, g) => n + g.permissions.length, 0)
    const count = groups.reduce((n, g) => n + g.permissions.filter((p) => isGranted(p.id, roleId)).length, 0)
    if (count === 0) return false
    if (count === total) return true
    return 'indeterminate'
  }

  function toggleRoleColumn(roleId: string) {
    if (readOnly) return
    const turnOn = roleState(roleId) !== true
    const next = { ...grants }
    for (const group of groups) {
      for (const permission of group.permissions) {
        const current = next[permission.id] ?? []
        const has = current.includes(roleId)
        next[permission.id] = turnOn
          ? has
            ? current
            : [...current, roleId]
          : has
            ? current.filter((id) => id !== roleId)
            : current
      }
    }
    setInternalGrants(next)
    onValueChange?.(next)
  }

  function groupSummary(group: PermissionGroup) {
    const total = group.permissions.length * allRoleIds.length
    const granted = group.permissions.reduce(
      (n, p) => n + allRoleIds.filter((roleId) => isGranted(p.id, roleId)).length,
      0,
    )
    return `${granted} of ${total} grants`
  }

  return (
    <SectionCard
      data-slot="role-matrix"
      title="Roles & permissions"
      description="What each role can do, grouped by resource."
      className={className}
      headerAction={
        readOnly ? (
          <Badge variant="secondary">
            <ShieldCheck aria-hidden="true" />
            Read-only
          </Badge>
        ) : undefined
      }
    >
      <div className="-mx-6 overflow-x-auto px-6">
        <Table className="max-w-[480px] min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[46%]">Permission</TableHead>
              {roles.map((role) => (
                <TableHead key={role.id} className="text-center">
                  <span className="block text-xs font-medium">{role.label}</span>
                  <Checkbox
                    checked={roleState(role.id)}
                    disabled={readOnly}
                    size="sm"
                    aria-label={`Toggle all ${role.label} permissions`}
                    className="mx-auto mt-1 block"
                    onCheckedChange={() => toggleRoleColumn(role.id)}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <React.Fragment key={group.resource}>
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={roles.length + 1} className="bg-muted/40 h-10 py-2">
                    <div className="flex items-center justify-between gap-x-2">
                      <span className="text-xs font-semibold tracking-wider uppercase">{group.resource}</span>
                      <span className="text-muted-foreground text-xs">{groupSummary(group)}</span>
                    </div>
                  </TableCell>
                </TableRow>
                {group.permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="py-2.5 pl-4 font-normal">{permission.label}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        <Checkbox
                          checked={isGranted(permission.id, role.id)}
                          disabled={readOnly}
                          size="sm"
                          aria-label={`${permission.label} — ${role.label}`}
                          className="mx-auto"
                          onCheckedChange={() => toggleCell(permission.id, role.id)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        Column headers toggle every permission for that role. Changes apply on save.
      </p>
    </SectionCard>
  )
}
