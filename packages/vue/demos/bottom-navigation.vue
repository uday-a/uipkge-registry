<script setup lang="ts">
import { ref } from "vue";
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
} from "lucide-vue-next";
import {
  BottomNavigation,
  type BottomNavItem,
} from "@/components/ui/bottom-navigation";

const active = ref("home");
const shopActive = ref("shop");
const fiveActive = ref("a");
const narrowActive = ref("a");

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
</script>

<template>
  <Story
    title="Mobile app shell"
    description="A realistic phone frame with a content area that reacts to the active tab. Tap a tab — the active pill slides and the icon gently scales."
  >
    <div
      class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm"
    >
      <div
        class="bg-background flex h-56 flex-col items-center justify-center gap-2 p-6 text-center"
      >
        <p class="text-sm font-medium">
          {{ items.find((i) => i.value === active)?.label }}
        </p>
        <p class="text-muted-foreground text-xs">{{ views[active] }}</p>
      </div>
      <BottomNavigation :items="items" v-model="active" :fixed="false" />
    </div>
  </Story>

  <Story
    title="Shopping app with badges"
    description="Numeric and text badges surface counts that need attention — cart saves, unread inbox, and more."
  >
    <div
      class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm"
    >
      <div
        class="bg-background flex h-48 flex-col items-center justify-center gap-1 p-6 text-center"
      >
        <p class="text-sm font-medium">
          {{ shopItems.find((i) => i.value === shopActive)?.label }}
        </p>
        <p class="text-muted-foreground text-xs">Your shopping hub</p>
      </div>
      <BottomNavigation
        :items="shopItems"
        v-model="shopActive"
        :fixed="false"
      />
    </div>
  </Story>

  <Story
    title="Custom active color"
    description="Override the active item color with a Tailwind class to match your brand — here a violet accent."
  >
    <div
      class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm"
    >
      <div
        class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-sm"
      >
        Violet brand
      </div>
      <BottomNavigation
        :items="items"
        v-model="active"
        :fixed="false"
        active-color="text-violet-600"
      />
    </div>
  </Story>

  <Story
    title="5 tabs & no indicator"
    description="Left: five evenly spaced tabs. Right: the active pill hidden for a flatter, more minimal look."
  >
    <div class="grid max-w-md gap-4 sm:grid-cols-2">
      <div class="border-border overflow-hidden rounded-2xl border">
        <div
          class="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs"
        >
          Five tabs
        </div>
        <BottomNavigation
          :items="[
            { value: 'a', label: 'Home', icon: Home },
            { value: 'b', label: 'Search', icon: Search },
            { value: 'c', label: 'Alerts', icon: Bell, badge: 5 },
            { value: 'd', label: 'Settings', icon: Settings },
            { value: 'e', label: 'Profile', icon: User },
          ]"
          v-model="fiveActive"
          :fixed="false"
        />
      </div>
      <div class="border-border overflow-hidden rounded-2xl border">
        <div
          class="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs"
        >
          No pill
        </div>
        <BottomNavigation
          :items="items"
          v-model="active"
          :fixed="false"
          :show-indicator="false"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Long labels on narrow screens"
    description="Labels truncate gracefully when space is tight — the worst case for a 200px-wide device."
  >
    <div
      class="border-border mx-auto w-full max-w-[200px] overflow-hidden rounded-2xl border"
    >
      <div
        class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs"
      >
        Narrow
      </div>
      <BottomNavigation
        :items="[
          { value: 'a', label: 'Dashboard', icon: Home },
          { value: 'b', label: 'Notifications', icon: Bell, badge: 99 },
          { value: 'c', label: 'Account Settings', icon: Settings },
        ]"
        v-model="narrowActive"
        :fixed="false"
      />
    </div>
  </Story>

  <Story
    title="Router integration"
    description="Items carry a `to` prop for vue-router links — the component pushes the route when a tab is selected."
  >
    <div
      class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border"
    >
      <div
        class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs"
      >
        Router-ready
      </div>
      <BottomNavigation
        :items="[
          { value: 'home', label: 'Home', icon: Home, to: '/' },
          { value: 'about', label: 'About', icon: Search, to: '/about' },
          {
            value: 'settings',
            label: 'Settings',
            icon: Settings,
            to: '/settings',
          },
        ]"
        :fixed="false"
      />
    </div>
  </Story>
</template>
