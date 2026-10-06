<script lang="ts">
  import { IconBox, IconStack } from '@svelte-registry/icon-box'
  import {
    Bell,
    Heart,
    Star,
    Settings,
    Zap,
    Folder,
    Image,
    Music,
    Video,
    FileText,
    Calendar,
    Users,
    ShieldCheck,
    Sparkles,
    Inbox,
    AlertTriangle,
  } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const tiles = [
    { icon: Folder, label: 'Documents', count: '128', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Image, label: 'Photos', count: '2,431', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { icon: Music, label: 'Music', count: '512', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: Video, label: 'Videos', count: '64', color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { icon: FileText, label: 'Notes', count: '349', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Calendar, label: 'Events', count: '24', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ]
</script>

{#if story === 'Variants'}
  <div class="flex flex-wrap items-center gap-3">
    <IconBox icon={Bell} variant="primary" />
    <IconBox icon={Heart} variant="muted" />
    <IconBox icon={Star} variant="custom" class="bg-amber-500/15" iconClass="text-amber-500" />
  </div>
{/if}

{#if story === 'Shapes'}
  <div class="flex flex-wrap items-center gap-3">
    <IconBox icon={Settings} shape="rounded" />
    <IconBox icon={Settings} shape="circle" />
    <IconBox icon={Zap} variant="muted" shape="rounded" />
    <IconBox icon={Zap} variant="muted" shape="circle" />
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-wrap items-center gap-3">
    <IconBox icon={Bell} size="sm" />
    <IconBox icon={Bell} size="md" />
    <IconBox icon={Bell} size="lg" />
  </div>
{/if}

{#if story === 'Custom colors'}
  <div class="flex flex-wrap items-center gap-3">
    <IconBox icon={Heart} variant="custom" class="bg-rose-500/15" iconClass="text-rose-500" />
    <IconBox icon={Star} variant="custom" class="bg-amber-500/15" iconClass="text-amber-500" />
    <IconBox icon={Zap} variant="custom" class="bg-emerald-500/15" iconClass="text-emerald-500" />
    <IconBox icon={Bell} variant="custom" class="bg-sky-500/15" iconClass="text-sky-500" />
    <IconBox icon={Users} variant="custom" class="bg-violet-500/15" iconClass="text-violet-500" />
    <IconBox icon={Settings} variant="custom" class="bg-orange-500/15" iconClass="text-orange-500" />
  </div>
{/if}

{#if story === 'Category tiles'}
  <div class="grid max-w-3xl gap-3 sm:grid-cols-2 md:grid-cols-3">
    {#each tiles as t (t.label)}
      <div
        class="border-border bg-card cursor-pointer rounded-xl border transition-[box-shadow,translate] hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-center gap-3 p-4">
          <IconBox icon={t.icon} variant="custom" size="lg" class={t.bg} iconClass={t.color} />
          <div>
            <p class="text-sm font-semibold">{t.label}</p>
            <p class="text-muted-foreground text-xs">{t.count} items</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}

{#if story === 'Surface Tiles & Tokens'}
  <div class="flex flex-wrap items-center gap-3">
    <IconBox icon={ShieldCheck} variant="solid" size="md" />
    <IconBox icon={Star} variant="outline" size="md" />
    <IconBox icon={Sparkles} variant="subtle" size="md" />
    <IconBox icon={AlertTriangle} variant="destructive" size="md" />
    <IconBox icon={ShieldCheck} variant="success" size="md" />
    <IconBox icon={Bell} variant="warning" size="md" />
  </div>
{/if}

{#if story === 'Isometric Icon Stack'}
  <div class="flex flex-wrap items-center gap-8 py-4">
    <IconStack icon={Inbox} variant="primary" size="md" />
    <IconStack icon={Sparkles} variant="muted" size="md" />
    <IconStack icon={ShieldCheck} variant="success" size="lg" />
    <IconStack icon={AlertTriangle} variant="destructive" size="md" />
  </div>
{/if}
