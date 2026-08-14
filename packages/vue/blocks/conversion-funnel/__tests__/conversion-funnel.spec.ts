import { describeBlock } from '../../../test-utils/test-render'
import ConversionFunnel from '../ConversionFunnel.vue'

describeBlock('ConversionFunnel', ConversionFunnel, {
  props: {
    data: [
      { name: 'Visitors', value: 1000 },
      { name: 'Signups', value: 300 },
    ],
  },
})
