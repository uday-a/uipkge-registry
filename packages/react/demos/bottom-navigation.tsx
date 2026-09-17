import { useState } from "react";
import {
  Bell,
  Heart,
  Home,
  Inbox,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import Story from "../../components/story/Story";
import {
  BottomNavigation,
  type BottomNavItem,
} from "@react-registry/bottom-navigation";

export default function BottomNavigationDemo() {
  const [active, setActive] = useState("home");
  const [shopActive, setShopActive] = useState("shop");
  const [fiveActive, setFiveActive] = useState("a");
  const [narrowActive, setNarrowActive] = useState("a");

  const items: BottomNavItem[] = [
    { value: "home", label: "Home", icon: Home },
    { value: "search", label: "Search", icon: Search },
    { value: "notifications", label: "Alerts", icon: Bell, badge: 3 },
    { value: "profile", label: "Profile", icon: User },
  ];

  const shopItems: BottomNavItem[] = [
    { value: "shop", label: "Shop", icon: ShoppingCart },
    { value: "saved", label: "Saved", icon: Heart, badge: 12 },
    { value: "inbox", label: "Inbox", icon: Inbox, badge: "!" },
    { value: "menu", label: "More", icon: Menu },
  ];

  const views: Record<string, string> = {
    home: "Welcome back — your feed is up to date.",
    search: "Search across products, orders, and stores.",
    notifications: "3 new alerts waiting for you.",
    profile: "Manage your account and preferences.",
  };

  return (
    <>
      <Story
        title="Mobile app shell"
        description="A realistic phone frame with a content area that reacts to the active tab. Tap a tab — the active pill slides and the icon gently scales."
      >
        <div className="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
          <div className="bg-background flex h-56 flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm font-medium">
              {items.find((i) => i.value === active)?.label}
            </p>
            <p className="text-muted-foreground text-xs">{views[active]}</p>
          </div>
          <BottomNavigation
            items={items}
            value={active}
            onValueChange={setActive}
            fixed={false}
          />
        </div>
      </Story>

      <Story
        title="Shopping app with badges"
        description="Numeric and text badges surface counts that need attention — cart saves, unread inbox, and more."
      >
        <div className="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
          <div className="bg-background flex h-48 flex-col items-center justify-center gap-1 p-6 text-center">
            <p className="text-sm font-medium">
              {shopItems.find((i) => i.value === shopActive)?.label}
            </p>
            <p className="text-muted-foreground text-xs">Your shopping hub</p>
          </div>
          <BottomNavigation
            items={shopItems}
            value={shopActive}
            onValueChange={setShopActive}
            fixed={false}
          />
        </div>
      </Story>

      <Story
        title="Custom active color"
        description="Override the active item color with a Tailwind class to match your brand — here a violet accent."
      >
        <div className="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
          <div className="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-sm">
            Violet brand
          </div>
          <BottomNavigation
            items={items}
            value={active}
            onValueChange={setActive}
            fixed={false}
            activeColor="text-violet-600"
          />
        </div>
      </Story>

      <Story
        title="5 tabs & no indicator"
        description="Left: five evenly spaced tabs. Right: the active pill hidden for a flatter, more minimal look."
      >
        <div className="grid max-w-md gap-4 sm:grid-cols-2">
          <div className="border-border overflow-hidden rounded-2xl border">
            <div className="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs">
              Five tabs
            </div>
            <BottomNavigation
              items={[
                { value: "a", label: "Home", icon: Home },
                { value: "b", label: "Search", icon: Search },
                { value: "c", label: "Alerts", icon: Bell, badge: 5 },
                { value: "d", label: "Settings", icon: Settings },
                { value: "e", label: "Profile", icon: User },
              ]}
              value={fiveActive}
              onValueChange={setFiveActive}
              fixed={false}
            />
          </div>
          <div className="border-border overflow-hidden rounded-2xl border">
            <div className="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs">
              No pill
            </div>
            <BottomNavigation
              items={items}
              value={active}
              onValueChange={setActive}
              fixed={false}
              showIndicator={false}
            />
          </div>
        </div>
      </Story>

      <Story
        title="Long labels on narrow screens"
        description="Labels truncate gracefully when space is tight — the worst case for a 200px-wide device."
      >
        <div className="border-border mx-auto w-full max-w-[200px] overflow-hidden rounded-2xl border">
          <div className="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs">
            Narrow
          </div>
          <BottomNavigation
            items={[
              { value: "a", label: "Dashboard", icon: Home },
              { value: "b", label: "Notifications", icon: Bell, badge: 99 },
              { value: "c", label: "Account Settings", icon: Settings },
            ]}
            value={narrowActive}
            onValueChange={setNarrowActive}
            fixed={false}
          />
        </div>
      </Story>

      <Story
        title="Router integration"
        description="Items carry a `to` prop for link integration — the component renders an anchor that navigates when a tab is selected."
      >
        <div className="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border">
          <div className="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs">
            Router-ready
          </div>
          <BottomNavigation
            items={[
              { value: "home", label: "Home", icon: Home, to: "/" },
              { value: "about", label: "About", icon: Search, to: "/about" },
              {
                value: "settings",
                label: "Settings",
                icon: Settings,
                to: "/settings",
              },
            ]}
            fixed={false}
          />
        </div>
      </Story>
    </>
  );
}
