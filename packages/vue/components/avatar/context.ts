import type { InjectionKey, Ref } from "vue";

export type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";

export interface AvatarContext {
  imageStatus: Ref<AvatarImageStatus>;
  setImageStatus: (status: AvatarImageStatus) => void;
}

export const AVATAR_INJECTION_KEY: InjectionKey<AvatarContext> =
  Symbol("uipkge-avatar");
