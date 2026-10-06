export { default as Avatar, type AvatarProps } from './Avatar.svelte'
export { default as AvatarFallback, type AvatarFallbackProps } from './AvatarFallback.svelte'
export { default as AvatarImage, type AvatarImageProps } from './AvatarImage.svelte'
export { default as AvatarGroup, type AvatarGroupProps } from './AvatarGroup.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Avatar.svelte <-> index.ts circular import that broke dev SSR).
export {
  avatarVariants,
  avatarFallbackVariants,
  type AvatarVariants,
  type AvatarFallbackVariants,
} from './avatar.variants'
