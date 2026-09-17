import Story from '../../components/story/Story'
import { DataCatalogLineage } from '@react-registry-blocks/data-catalog-lineage/DataCatalogLineage'

export default function DataCatalogLineageDemo() {
  return (
    <Story
      title="Default"
      description="Alation/Monte Carlo-style data catalog lineage map and table documentation explorer with upstream source tracking, dbt transformation models, downstream BI consumer graphs, schema dictionary, and automated data quality assertions."
    >
      <DataCatalogLineage />
    </Story>
  )
}
