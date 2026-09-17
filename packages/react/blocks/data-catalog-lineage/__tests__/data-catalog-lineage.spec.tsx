import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DataCatalogLineage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DataCatalogLineage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DataCatalogLineage', Component)
