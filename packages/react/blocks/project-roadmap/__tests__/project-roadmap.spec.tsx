import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ProjectRoadmap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ProjectRoadmap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ProjectRoadmap', Component)
