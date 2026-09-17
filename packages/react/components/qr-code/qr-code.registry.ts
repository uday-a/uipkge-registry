import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "qr-code",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "QR code renderer — pass `value` and a size, get a canvas PNG or SVG. Useful for sign-in links, share URLs, and Wi-Fi credentials. Depends on the `qrcode` package.",
  files: [
    { path: "QrCode.tsx", target: "components/ui/qr-code/QrCode.tsx" },
    { path: "index.ts", target: "components/ui/qr-code/index.ts" },
  ],
  dependencies: ["qrcode", "lucide-react"],
  devDependencies: ["@types/qrcode"],
  registryDependencies: [],
});
