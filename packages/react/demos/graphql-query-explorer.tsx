import Story from '../../components/story/Story'
import { GraphqlQueryExplorer } from '@react-registry-blocks/graphql-query-explorer/GraphqlQueryExplorer'

export default function GraphqlQueryExplorerDemo() {
  return (
    <Story
      title="Default"
      description="Apollo and GraphiQL style GraphQL query builder and response inspector. Features schema documentation explorer, syntax-highlighted query & variables editor, query history presets, execution tracing, and formatted JSON response viewer."
    >
      <GraphqlQueryExplorer />
    </Story>
  )
}
