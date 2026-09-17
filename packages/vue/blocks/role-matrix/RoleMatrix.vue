<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { ShieldCheck } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionCard } from '@/components/ui/section-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Role {
  id: string
  label: string
}

interface Permission {
  id: string
  label: string
}

interface PermissionGroup {
  resource: string
  permissions: Permission[]
}

const props = withDefaults(
  defineProps<{
    roles?: Role[]
    groups?: PermissionGroup[]
    /** permissionId -> array of granted roleIds. */
    modelValue?: Record<string, string[]>
    readOnly?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    roles: () => [
      { id: 'admin', label: 'Admin' },
      { id: 'editor', label: 'Editor' },
      { id: 'viewer', label: 'Viewer' },
    ],
    groups: () => [
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
    ],
    modelValue: undefined,
    readOnly: false,
  },
)

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

const emit = defineEmits<{ 'update:modelValue': [Record<string, string[]>] }>()

// Internal working copy keeps the block self-contained; consumers can pass
// v-model to mirror changes out (we never mutate props directly).
const internalGrants = ref<Record<string, string[]>>(props.modelValue ? { ...props.modelValue } : { ...defaultGrants })
const grants = computed(() => internalGrants.value)
const allRoleIds = computed(() => props.roles.map((r) => r.id))

function setGrant(permissionId: string, roleIds: string[]) {
  internalGrants.value = { ...internalGrants.value, [permissionId]: roleIds }
  if (props.modelValue !== undefined) emit('update:modelValue', { ...internalGrants.value })
}

function isGranted(permissionId: string, roleId: string) {
  return (grants.value[permissionId] ?? []).includes(roleId)
}

function toggleCell(permissionId: string, roleId: string) {
  if (props.readOnly) return
  const current = grants.value[permissionId] ?? []
  setGrant(permissionId, current.includes(roleId) ? current.filter((id) => id !== roleId) : [...current, roleId])
}

function roleState(roleId: string): boolean | 'indeterminate' {
  const total = props.groups.reduce((n, g) => n + g.permissions.length, 0)
  const count = props.groups.reduce((n, g) => n + g.permissions.filter((p) => isGranted(p.id, roleId)).length, 0)
  if (count === 0) return false
  if (count === total) return true
  return 'indeterminate'
}

function toggleRoleColumn(roleId: string) {
  if (props.readOnly) return
  const turnOn = roleState(roleId) !== true
  for (const group of props.groups) {
    for (const permission of group.permissions) {
      const current = grants.value[permission.id] ?? []
      const has = current.includes(roleId)
      if (turnOn && !has) setGrant(permission.id, [...current, roleId])
      if (!turnOn && has)
        setGrant(
          permission.id,
          current.filter((id) => id !== roleId),
        )
    }
  }
}

function groupSummary(group: PermissionGroup) {
  const total = group.permissions.length * allRoleIds.value.length
  const granted = group.permissions.reduce(
    (n, p) => n + allRoleIds.value.filter((roleId) => isGranted(p.id, roleId)).length,
    0,
  )
  return `${granted} of ${total} grants`
}
</script>

<template>
  <SectionCard
    data-slot="role-matrix"
    title="Roles & permissions"
    description="What each role can do, grouped by resource."
    :class="props.class"
  >
    <template #header-action>
      <Badge v-if="readOnly" variant="secondary">
        <ShieldCheck aria-hidden="true" />
        Read-only
      </Badge>
    </template>

    <div class="-mx-6 overflow-x-auto px-6">
      <Table class="max-w-[480px] min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead class="w-[46%]">Permission</TableHead>
            <TableHead v-for="role in roles" :key="role.id" class="text-center">
              <span class="block text-xs font-medium">{{ role.label }}</span>
              <Checkbox
                :model-value="roleState(role.id)"
                :disabled="readOnly"
                size="sm"
                :aria-label="`Toggle all ${role.label} permissions`"
                class="mx-auto mt-1 block"
                @update:model-value="toggleRoleColumn(role.id)"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="group in groups" :key="group.resource" class="hover:bg-transparent">
            <TableCell :colspan="roles.length + 1" class="bg-muted/40 h-10 py-2">
              <div class="flex items-center justify-between gap-x-2">
                <span class="text-xs font-semibold tracking-wider uppercase">{{ group.resource }}</span>
                <span class="text-muted-foreground text-xs">{{ groupSummary(group) }}</span>
              </div>
            </TableCell>
          </TableRow>
          <template v-for="group in groups" :key="group.resource + '-rows'">
            <TableRow v-for="permission in group.permissions" :key="permission.id">
              <TableCell class="py-2.5 pl-4 font-normal">{{ permission.label }}</TableCell>
              <TableCell v-for="role in roles" :key="role.id" class="text-center">
                <Checkbox
                  :model-value="isGranted(permission.id, role.id)"
                  :disabled="readOnly"
                  size="sm"
                  :aria-label="`${permission.label} — ${role.label}`"
                  class="mx-auto"
                  @update:model-value="toggleCell(permission.id, role.id)"
                />
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <p class="text-muted-foreground mt-4 text-xs">
      Column headers toggle every permission for that role. Changes apply on save.
    </p>
  </SectionCard>
</template>
