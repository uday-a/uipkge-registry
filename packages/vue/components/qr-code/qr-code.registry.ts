import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "qr-code",
  type: "registry:ui",
  categories: ["data-display"],
  framework: "vue",
  description:
    "QR code renderer — pass `value` and a size, get a canvas PNG or SVG. Useful for sign-in links, share URLs, and Wi-Fi credentials. Depends on the `qrcode` package.",
  files: [
    { path: "QRCode.vue", target: "components/ui/qr-code/QRCode.vue" },
    { path: "index.ts", target: "components/ui/qr-code/index.ts" },
  ],
  dependencies: ["qrcode", "lucide-vue-next"],
  registryDependencies: [],
});
