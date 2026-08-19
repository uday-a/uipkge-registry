// Ambient types for bootstrap/use-theme/00.theme.ts -- a consumer-side Nitro
// plugin. Nitro only exists in the consumer's Nuxt app, not in this repo, so
// declare the minimal surface for the shipped file to typecheck here.
declare module "nitropack/runtime" {
  interface NitroHtmlRenderContext {
    head: string[];
    body: string[];
    [key: string]: unknown;
  }
  interface NitroApp {
    hooks: {
      hook(
        name: "render:html",
        fn: (html: NitroHtmlRenderContext) => void,
      ): void;
      hook(name: string, fn: (...args: unknown[]) => void): void;
    };
  }
  export function defineNitroPlugin(fn: (nitroApp: NitroApp) => void): unknown;
}
