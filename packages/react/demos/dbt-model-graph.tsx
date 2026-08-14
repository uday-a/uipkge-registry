import Story from '../../components/story/Story'
import { DbtModelGraph } from '@react-registry-blocks/dbt-model-graph/DbtModelGraph'

export default function DbtModelGraphDemo() {
  return (
    <Story
      title="Default"
      description="dbt Cloud style data modeling DAG dependency graph, compiled SQL view, and model documentation with lineage tree, Jinja/SQL source editor, compiled warehouse query, and column contract test suite."
    >
      <DbtModelGraph />
    </Story>
  )
}
