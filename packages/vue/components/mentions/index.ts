export interface MentionOption {
  value: string;
  label: string;
  description?: string;
  avatar?: string;
  email?: string;
  handle?: string;
  bio?: string;
  joined?: string;
  following?: number | string;
  followers?: number | string;
  verified?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export { default as Mentions } from "./Mentions.vue";
export { default as MentionTag } from "./MentionTag.vue";
