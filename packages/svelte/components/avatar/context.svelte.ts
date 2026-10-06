export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * Shared mutable state between `Avatar` and its `AvatarImage` /
 * `AvatarFallback` children. Created in `Avatar.svelte` and shared via
 * `setContext` / `getContext` (Svelte counterpart of Vue's provide/inject).
 */
export class AvatarContextState {
  status = $state<AvatarImageStatus>('idle')

  setStatus(status: AvatarImageStatus) {
    this.status = status
  }
}

export const AVATAR_CONTEXT_KEY = Symbol('uipkge-avatar')
