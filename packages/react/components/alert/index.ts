export {
  Alert,
  AlertTitle,
  AlertDescription,
  type AlertProps,
  type AlertTitleProps,
} from "./alert";

// Re-export variant API from the sibling file (kept separate to avoid the
// alert.tsx <-> index.ts circular import — mirrors the Vue registry).
export { alertVariants, type AlertVariants } from "./alert.variants";
