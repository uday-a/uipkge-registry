import Story from '../../components/story/Story'
import { FeatureStoreRegistry } from '@react-registry-blocks/feature-store-registry/FeatureStoreRegistry'

export default function FeatureStoreRegistryDemo() {
  return (
    <Story
      title="Default"
      description="Feast / Tecton style machine learning feature store registry with entity definitions, online Redis cache hit rates, batch Snowflake source lineage, feature definitions table, and Python Feast code definition."
    >
      <FeatureStoreRegistry />
    </Story>
  )
}
