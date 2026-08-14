import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DataMeshDomainCatalog'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DataMeshDomainCatalog'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DataMeshDomainCatalog', Component)
