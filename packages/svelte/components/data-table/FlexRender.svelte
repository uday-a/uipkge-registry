<script lang="ts" module>
  import type { ColumnDefTemplate } from '@tanstack/table-core'

  export interface FlexRenderProps<TContext extends object> {
    /** `columnDef.header` / `columnDef.cell` / `columnDef.footer`. */
    content: ColumnDefTemplate<TContext> | undefined
    /** `header.getContext()` / `cell.getContext()`. */
    context: TContext
  }
</script>

<script lang="ts" generics="TContext extends object">
  import { RenderComponentConfig, RenderSnippetConfig } from './render-helpers'

  // Svelte twin of @tanstack/react-table's `flexRender`: strings render as
  // text; functions are called with the context and may return a primitive,
  // `renderComponent(...)` or `renderSnippet(...)`.
  let { content, context }: FlexRenderProps<TContext> = $props()

  const result = $derived(typeof content === 'function' ? (content as (ctx: TContext) => unknown)(context) : content)
</script>

{#if result instanceof RenderComponentConfig}
  {@const Comp = result.component}
  <Comp {...result.props} />
{:else if result instanceof RenderSnippetConfig}
  {@render result.snippet(result.params)}
{:else if result !== null && result !== undefined && result !== false}
  {result}
{/if}
