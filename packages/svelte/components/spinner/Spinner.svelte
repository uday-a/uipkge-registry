<script lang="ts" module>
  import type { LucideProps } from '@lucide/svelte'
  import type { SpinnerVariants } from './spinner.variants'

  // LucideProps (extends SVGAttributes) so rest-spread into the icon
  // typechecks; `size` is the cva tier, not lucide's pixel size.
  export interface SpinnerProps extends Omit<LucideProps, 'size'> {
    size?: SpinnerVariants['size']
  }
</script>

<script lang="ts">
  import { Loader2 } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { spinnerVariants } from './spinner.variants'

  let { class: className, size = 'default', ...restProps }: SpinnerProps = $props()
</script>

<Loader2
  data-uipkge=""
  data-slot="spinner"
  class={cn(spinnerVariants({ size }), className as string | undefined)}
  aria-label="Loading"
  role="status"
  {...restProps}
/>
