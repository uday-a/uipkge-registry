import { ref, watch } from "vue";

type Theme = "light" | "dark" | "system";
const COOKIE_KEY = "uipkge-theme";

// Framework-agnostic theme composable backed by a cookie (not localStorage)
// so the initial paint can match the saved theme. The cookie is read/written
// directly via document.cookie -- no Nuxt useCookie dependency -- which means
// this works in plain Vue, Vue+Vite, Nuxt, or any Vue setup.
//
// Under Nuxt, the optional Nitro server plugin in 00.theme.ts inlines a
// blocking <script> that sets the dark class on <html> BEFORE first paint
// (zero-flash SSR). That plugin reads the same cookie, so the SSR pass and
// the client agree on the initial theme. Without Nuxt, the composable still
// applies the dark class on mount -- there's just a one-frame window where
// the class isn't set yet.
//
// localStorage was intentionally avoided: it doesn't exist server-side, so an
// SSR pass would always render `system` and then the client would flip to the
// saved value, producing a hydration mismatch.

function readCookie(): Theme {
  if (typeof document === "undefined") return "system";
  const m = document.cookie.match(/(?:^|; )uipkge-theme=([^;]+)/);
  return (m ? decodeURIComponent(m[1]) : "system") as Theme;
}

function writeCookie(value: Theme) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function useTheme() {
  const theme = ref<Theme>(readCookie());

  function setTheme(next: Theme) {
    theme.value = next;
  }

  function apply(next: Theme) {
    if (typeof window === "undefined") return;
    const isDark =
      next === "dark" ||
      (next === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }

  if (typeof window !== "undefined") {
    apply(theme.value);
    watch(theme, (next) => {
      writeCookie(next);
      apply(next);
    });
  }

  return { theme, setTheme };
}
