export { default as Avatar } from './Avatar.vue'
export { default as AvatarFallback } from './AvatarFallback.vue'
export { default as AvatarImage } from './AvatarImage.vue'
export { default as AvatarGroup } from './AvatarGroup.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// Avatar.vue <-> index.ts circular import that broke dev SSR).
export {
  avatarVariants,
  avatarFallbackVariants,
  type AvatarVariants,
  type AvatarFallbackVariants,
} from './avatar.variants'
