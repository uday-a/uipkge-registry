export interface MentionOption {
  value: string
  label: string
  description?: string
  avatar?: string
  email?: string
  handle?: string
  bio?: string
  joined?: string
  following?: number | string
  followers?: number | string
  verified?: boolean
  disabled?: boolean
  [key: string]: any
}

export { default as Mentions, type MentionsProps } from './Mentions.svelte'
export { default as MentionTag, type MentionTagProps } from './MentionTag.svelte'
