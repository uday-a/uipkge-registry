export interface AnchorItem {
  href: string;
  title: string;
  children?: AnchorItem[];
}

export { default as Anchor } from "./Anchor.vue";
export { default as AnchorLink } from "./AnchorLink.vue";
