import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ToggleSettingList'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ToggleSettingList'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ToggleSettingList', Component, {
  props: {
    items: [],
    value: {},
  },
})
