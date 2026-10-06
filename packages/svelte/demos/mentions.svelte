<script lang="ts">
  import { Mentions, MentionTag, type MentionOption } from '@svelte-registry/mentions'

  let { story }: { story: string } = $props()

  let text1 = $state('Hey @ada, check out the new design system update!')
  let text2 = $state('Hey ')
  let text3 = $state('Drafting notes with @sarah and #v2-launch tracking $NVDA ')
  let text4 = $state('')
  let picked = $state<MentionOption | null>(null)

  interface User extends MentionOption {
    description?: string
    avatar?: string
  }

  const users: User[] = [
    {
      value: 'ada',
      label: 'Ada Lovelace',
      handle: 'adalovelace',
      email: 'ada@computing.org',
      description: 'First Computer Programmer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Mathematician and writer, chiefly known for work on Babbage’s mechanical general-purpose computer.',
      joined: 'March 2021',
      following: 128,
      followers: '42.5K',
      verified: true,
    },
    {
      value: 'grace',
      label: 'Grace Hopper',
      handle: 'ghopper',
      email: 'grace@navy.mil',
      description: 'Compilers & Systems Pioneer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      bio: 'Computer scientist and United States Navy rear admiral. Pioneer of compiler construction.',
      joined: 'January 2022',
      following: 256,
      followers: '94.1K',
      verified: true,
    },
    {
      value: 'linus',
      label: 'Linus Torvalds',
      handle: 'torvalds',
      email: 'linus@kernel.org',
      description: 'Linux & Git Creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Creator of the Linux kernel and the Git version control system. Still hacking on kernel trees.',
      joined: 'September 2020',
      following: 12,
      followers: '180K',
      verified: true,
    },
  ]

  const multiTriggerOptions: Record<string, MentionOption[]> = {
    '@': [
      { value: 'sarah', label: 'Sarah Connor', description: 'Tech Lead · SecOps' },
      { value: 'marcus', label: 'Marcus Vance', description: 'Staff Engineer' },
      { value: 'priya', label: 'Priya Nair', description: 'Design Systems' },
    ],
    '#': [
      { value: 'v2-launch', label: 'v2-launch', description: 'Next major release milestone' },
      { value: 'performance', label: 'performance', description: 'Core Web Vitals & bundle optimization' },
      { value: 'tokens', label: 'tokens', description: 'OKLCH color system adjustments' },
    ],
    $: [
      { value: 'AAPL', label: 'Apple Inc.', description: 'AAPL · NASDAQ · $224.23' },
      { value: 'NVDA', label: 'Nvidia Corp.', description: 'NVDA · NASDAQ · $118.50' },
      { value: 'TSLA', label: 'Tesla Inc.', description: 'TSLA · NASDAQ · $242.10' },
    ],
  }

  function loadUsers(q: string): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ql = q.toLowerCase()
        resolve(users.filter((u) => u.label.toLowerCase().includes(ql) || u.value.toLowerCase().includes(ql)))
      }, 300)
    })
  }
</script>

{#snippet customRow({ option, active }: { option: User; index: number; active: boolean; trigger: string })}
  <span class="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
    {option.label.slice(0, 2).toUpperCase()}
  </span>
  <span class="min-w-0 flex-1">
    <span class="block truncate font-medium">{option.label}</span>
    <span class="text-muted-foreground block truncate text-xs">@{option.value}{active ? ' — ↵ to insert' : ''}</span>
  </span>
{/snippet}

{#if story === 'Profile hover popup'}
  <div class="max-w-md space-y-2">
    <p class="text-sm">
      Shipped by <MentionTag
        name="Ada Lovelace"
        handle="adalovelace"
        email="ada@computing.org"
        avatar={users[0]?.avatar}
        bio={users[0]?.bio}
        joined={users[0]?.joined}
        following={users[0]?.following}
        followers={users[0]?.followers}
        verified
      /> and <MentionTag name="Grace Hopper" handle="ghopper" verified={false} popover={false} />.
    </p>
    <p class="text-muted-foreground text-xs">Hover the first tag for the profile card; the second has no popup.</p>
  </div>
{/if}

{#if story === 'Static options'}
  <div class="max-w-md space-y-2">
    <Mentions bind:value={text2} options={users} placeholder="Type @ to mention…" onselect={(o) => (picked = o)} />
    <p class="text-muted-foreground text-xs">
      Picked: <code class="text-foreground">{picked ? `${picked.label} (@${picked.value})` : '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Multi-trigger'}
  <div class="max-w-md">
    <Mentions
      bind:value={text3}
      options={multiTriggerOptions}
      triggers={['@', '#', '$']}
      placeholder="Try @, # or $…"
    />
  </div>
{/if}

{#if story === 'Async options'}
  <div class="max-w-md space-y-2">
    <Mentions
      bind:value={text4}
      loadOptions={(q) => loadUsers(q)}
      placeholder="Type @ to search (debounced)…"
    />
    <p class="text-muted-foreground text-xs">Options resolve 300ms after you stop typing.</p>
  </div>
{/if}

{#if story === 'Custom row content'}
  <div class="max-w-md">
    <Mentions bind:value={text1} options={users} option={customRow} />
  </div>
{/if}
