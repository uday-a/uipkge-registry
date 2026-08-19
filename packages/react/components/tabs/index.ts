export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
} from "./tabs";

// Re-export variant API from the sibling file (kept separate to avoid the
// component <-> index.ts circular import that broke dev SSR for Card).
export {
  tabsListVariants,
  tabsTriggerVariants,
  type TabsListVariants,
  type TabsTriggerVariants,
} from "./tabs.variants";
