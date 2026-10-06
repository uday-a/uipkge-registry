export { default as Skeleton, type SkeletonProps } from './Skeleton.svelte'
export { default as SkeletonText, type SkeletonTextProps } from './SkeletonText.svelte'
export { default as SkeletonGroup, type SkeletonGroupProps } from './SkeletonGroup.svelte'
export { default as SkeletonLoader, type SkeletonLoaderProps } from './SkeletonLoader.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// SkeletonLoader.svelte <-> index.ts circular import that broke dev SSR).
export { skeletonLoaderVariants, type SkeletonLoaderVariants } from './skeleton.variants'
