// Re-export next-themes' useTheme so consumers have a stable `~/lib/use-theme`
// import path that mirrors the Vue registry's useTheme composable.
// Returns { theme, setTheme, resolvedTheme, systemTheme }.
export { useTheme } from 'next-themes'
