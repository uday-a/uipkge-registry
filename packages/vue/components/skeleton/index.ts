export { default as Skeleton } from './Skeleton.vue'
export { default as SkeletonText } from './SkeletonText.vue'
export { default as SkeletonGroup } from './SkeletonGroup.vue'
export { default as SkeletonLoader } from './SkeletonLoader.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// SkeletonLoader.vue <-> index.ts circular import that broke dev SSR).
export { skeletonLoaderVariants, type SkeletonLoaderVariants } from './skeleton.variants'
