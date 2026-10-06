/**
 * Cell / header renderers for Svelte. React's column defs return JSX from
 * `header` / `cell`; in Svelte a column def returns one of these configs (or
 * a plain string / number) and `<FlexRender>` mounts it:
 *
 *   cell: ({ row }) => renderComponent(StatusBadge, { status: row.original.status })
 *   cell: ({ row }) => renderSnippet(statusCell, row.original)
 *   header: ({ column }) => renderComponent(DataTableColumnHeader, { column, label: 'Name' })
 */
import type { Component, ComponentProps, Snippet } from 'svelte'

export class RenderComponentConfig<TComponent extends Component<any>> {
  component: TComponent
  props: ComponentProps<TComponent> | Record<string, never>
  constructor(component: TComponent, props: ComponentProps<TComponent> | Record<string, never> = {}) {
    this.component = component
    this.props = props
  }
}

export class RenderSnippetConfig<TProps> {
  snippet: Snippet<[TProps]>
  params: TProps
  constructor(snippet: Snippet<[TProps]>, params: TProps) {
    this.snippet = snippet
    this.params = params
  }
}

/** Mount a Svelte component as a cell / header. */
export function renderComponent<TComponent extends Component<any>>(
  component: TComponent,
  props: ComponentProps<TComponent>,
): RenderComponentConfig<TComponent> {
  return new RenderComponentConfig(component, props)
}

/** Render a snippet (declared at the top level of your component) as a cell / header. */
export function renderSnippet<TProps>(snippet: Snippet<[TProps]>, params: TProps): RenderSnippetConfig<TProps> {
  return new RenderSnippetConfig(snippet, params)
}
