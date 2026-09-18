export {
  Skeleton,
  SkeletonGroup,
  SkeletonText,
  SkeletonLoader,
  type SkeletonProps,
  type SkeletonGroupProps,
  type SkeletonTextProps,
  type SkeletonLoaderProps,
} from './skeleton'

// Re-export variant API from the sibling file (kept separate to mirror the
// Vue registry convention and avoid a component <-> index circular import).
export { skeletonLoaderVariants, type SkeletonLoaderVariants } from './skeleton.variants'
