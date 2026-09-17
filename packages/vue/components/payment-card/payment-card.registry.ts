import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "payment-card",
  type: "registry:ui",
  framework: "vue",
  categories: ["data-display"],
  description:
    "Premium metallic credit-card visual with embossed type, holographic foil, and per-digit typing animation. Auto-detects brand (Visa, Mastercard, Amex, Discover), flips in 3D, and supports opt-in mouse-parallax tilt and shimmer. Pure presentational — pass typed values in via props.",
  files: [
    {
      path: "PaymentCard.vue",
      target: "components/ui/payment-card/PaymentCard.vue",
    },
    { path: "index.ts", target: "components/ui/payment-card/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
