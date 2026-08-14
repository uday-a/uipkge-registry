import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LabResultsViewer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LabResultsViewer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LabResultsViewer', Component)
