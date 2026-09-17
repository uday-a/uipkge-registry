export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  type AvatarProps,
  type AvatarFallbackProps,
  type AvatarGroupProps,
} from "./avatar";

// Re-export variant API from the sibling file (kept separate to mirror the
// Vue registry convention and avoid a component <-> index circular import).
export {
  avatarVariants,
  avatarFallbackVariants,
  type AvatarVariants,
  type AvatarFallbackVariants,
} from "./avatar.variants";
