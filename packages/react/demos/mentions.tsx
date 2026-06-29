import Story from '../../components/story/Story'
import { useMemo, useState } from 'react'
import { Mentions, type MentionOption } from '@react-registry/mentions'

interface User extends MentionOption {
  description?: string
  avatar?: string
}

const users: User[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Engineering' },
  { value: 'tim', label: 'Tim Berners-Lee', description: 'Web' },
  { value: 'linus', label: 'Linus Torvalds', description: 'Kernel' },
  { value: 'guido', label: 'Guido van Rossum', description: 'Python' },
  { value: 'matz', label: 'Yukihiro Matsumoto', description: 'Ruby' },
]

const channels: MentionOption[] = [
  { value: 'general', label: '#general' },
  { value: 'random', label: '#random' },
  { value: 'eng-frontend', label: '#eng-frontend' },
  { value: 'eng-backend', label: '#eng-backend' },
]

function loadUsers(q: string): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ql = q.toLowerCase()
      resolve(users.filter((u) => u.label.toLowerCase().includes(ql) || u.value.toLowerCase().includes(ql)))
    }, 400)
  })
}

export default function MentionsDemo() {
  const [text1, setText1] = useState('Hey ')
  const [text2, setText2] = useState('Hey ')
  const [text3, setText3] = useState('Type @ for users or # for channels: ')
  const [text4, setText4] = useState('')

  const options3 = useMemo<MentionOption[]>(() => (/[#]\w*$/.test(text3) ? channels : users), [text3])

  const usersWithAvatars = useMemo<User[]>(
    () => users.map((u) => ({ ...u, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + u.value })),
    [],
  )

  return (
    <>
      <Story title="Static options" description="Type @ to filter users.">
        <div className="space-y-2">
          <Mentions value={text1} onValueChange={setText1} options={users} placeholder="Type @ to mention..." />
          <pre className="text-muted-foreground text-xs">{text1}</pre>
        </div>
      </Story>

      <Story title="Async options" description="loadOptions returns a promise. Debounced 200ms.">
        <div className="space-y-2">
          <Mentions
            value={text2}
            onValueChange={setText2}
            loadOptions={loadUsers}
            placeholder="Type @ for async users..."
          />
          <pre className="text-muted-foreground text-xs">{text2}</pre>
        </div>
      </Story>

      <Story
        title="Multiple triggers"
        description="Pass an array of triggers - each opens the popup. Format function uses the active trigger."
      >
        <div className="space-y-2">
          <Mentions
            value={text3}
            onValueChange={setText3}
            triggers={['@', '#']}
            options={options3}
            format={(opt, trigger) => trigger + opt.value + ' '}
            placeholder="@ for users, # for channels"
          />
          <pre className="text-muted-foreground text-xs">{text3}</pre>
        </div>
      </Story>

      <Story title="Custom row content" description="Options with avatar + description render in two lines.">
        <div className="space-y-2">
          <Mentions
            value={text4}
            onValueChange={setText4}
            options={usersWithAvatars}
            placeholder="Type @ to see avatars..."
          />
          <pre className="text-muted-foreground text-xs">{text4}</pre>
        </div>
      </Story>
    </>
  )
}
