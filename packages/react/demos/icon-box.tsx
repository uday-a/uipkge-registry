import Story from "../../components/story/Story";
import { Card, CardContent } from "@react-registry/card";
import { IconBox, IconStack } from "@react-registry/icon-box";
import {
  AlertTriangle,
  Bell,
  Calendar,
  FileText,
  Folder,
  Heart,
  Image,
  Inbox,
  Music,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";

const tiles = [
  {
    icon: Folder,
    label: "Documents",
    count: "128",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Image,
    label: "Photos",
    count: "2,431",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Music,
    label: "Music",
    count: "512",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Video,
    label: "Videos",
    count: "64",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: FileText,
    label: "Notes",
    count: "349",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Calendar,
    label: "Events",
    count: "24",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export default function IconBoxDemo() {
  return (
    <>
      <Story
        title="Variants"
        description="Primary, muted, and custom variants control the background and icon color."
      >
        <div className="flex flex-wrap items-center gap-3">
          <IconBox icon={Bell} variant="primary" />
          <IconBox icon={Heart} variant="muted" />
          <IconBox
            icon={Star}
            variant="custom"
            className="bg-amber-500/15"
            iconClassName="text-amber-500"
          />
        </div>
      </Story>

      <Story title="Shapes" description="Rounded square versus circle.">
        <div className="flex flex-wrap items-center gap-3">
          <IconBox icon={Settings} shape="rounded" />
          <IconBox icon={Settings} shape="circle" />
          <IconBox icon={Zap} variant="muted" shape="rounded" />
          <IconBox icon={Zap} variant="muted" shape="circle" />
        </div>
      </Story>

      <Story
        title="Sizes"
        description="Three sizes — sm, md, and lg — adjust padding and icon scale."
      >
        <div className="flex flex-wrap items-center gap-3">
          <IconBox icon={Bell} size="sm" />
          <IconBox icon={Bell} size="md" />
          <IconBox icon={Bell} size="lg" />
        </div>
      </Story>

      <Story
        title="Custom colors"
        description="Use the custom variant with class and icon-class to compose any color treatment."
      >
        <div className="flex flex-wrap items-center gap-3">
          <IconBox
            icon={Heart}
            variant="custom"
            className="bg-rose-500/15"
            iconClassName="text-rose-500"
          />
          <IconBox
            icon={Star}
            variant="custom"
            className="bg-amber-500/15"
            iconClassName="text-amber-500"
          />
          <IconBox
            icon={Zap}
            variant="custom"
            className="bg-emerald-500/15"
            iconClassName="text-emerald-500"
          />
          <IconBox
            icon={Bell}
            variant="custom"
            className="bg-sky-500/15"
            iconClassName="text-sky-500"
          />
          <IconBox
            icon={Users}
            variant="custom"
            className="bg-violet-500/15"
            iconClassName="text-violet-500"
          />
          <IconBox
            icon={Settings}
            variant="custom"
            className="bg-orange-500/15"
            iconClassName="text-orange-500"
          />
        </div>
      </Story>

      <Story
        title="Category tiles"
        description="Real-world layout pairing IconBox with labels and counts in a card grid."
      >
        <div className="grid max-w-3xl gap-3 sm:grid-cols-2 md:grid-cols-3">
          {tiles.map((t) => (
            <Card
              key={t.label}
              className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="flex items-center gap-3 p-4">
                <IconBox
                  icon={t.icon}
                  variant="custom"
                  size="lg"
                  className={t.bg}
                  iconClassName={t.color}
                />
                <div>
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-muted-foreground text-xs">
                    {t.count} items
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Story>

      <Story
        title="Surface Tiles & Tokens"
        description="Solid, outline, subtle, and status surface containers with calibrated radius and token hierarchy."
      >
        <div className="flex flex-wrap items-center gap-3">
          <IconBox icon={ShieldCheck} variant="solid" size="md" />
          <IconBox icon={Star} variant="outline" size="md" />
          <IconBox icon={Sparkles} variant="subtle" size="md" />
          <IconBox icon={AlertTriangle} variant="destructive" size="md" />
          <IconBox icon={ShieldCheck} variant="success" size="md" />
          <IconBox icon={Bell} variant="warning" size="md" />
        </div>
      </Story>

      <Story
        title="Isometric Icon Stack"
        description="2.5D layered isometric container for elevated empty states, hero cards, and feature callouts."
      >
        <div className="flex flex-wrap items-center gap-8 py-4">
          <IconStack icon={Inbox} variant="primary" size="md" />
          <IconStack icon={Sparkles} variant="muted" size="md" />
          <IconStack icon={ShieldCheck} variant="success" size="lg" />
          <IconStack icon={AlertTriangle} variant="destructive" size="md" />
        </div>
      </Story>
    </>
  );
}
