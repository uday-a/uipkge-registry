import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EtlPipelineDag'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EtlPipelineDag'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EtlPipelineDag', Component)
