import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../GuardrailsSafetyScanner'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['GuardrailsSafetyScanner'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('GuardrailsSafetyScanner', Component)
