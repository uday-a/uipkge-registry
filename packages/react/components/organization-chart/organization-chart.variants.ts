import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const organizationChartVariants = cva('bg-background rounded-lg border')

export type OrganizationChartVariants = VariantProps<typeof organizationChartVariants>
