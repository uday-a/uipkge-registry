import Story from '../../components/story/Story'
import { StorePickupCurbside } from '@react-registry-blocks/store-pickup-curbside/StorePickupCurbside'

export default function StorePickupCurbsideDemo() {
  return (
    <>
      <Story
        title="Store Pickup & Curbside Coordination"
        description="Buy Online Pick Up in Store (BOPIS) & curbside pickup coordination board with customer arrival parking check-in, real-time staging bin tracking, runner fulfillment dispatch, and SLA monitoring."
      >
        <StorePickupCurbside />
      </Story>

      <Story
        title="Curbside Bay Filtered"
        description="Curbside pickup mode view showing parking bays #1-#6 with live vehicle arrival status and hazard light alerts."
      >
        <StorePickupCurbside initialModeFilter="curbside" />
      </Story>

      <Story
        title="In-Store Pickup Desk"
        description="In-store customer desk staging view with secure smart locker PINs and counter bays."
      >
        <StorePickupCurbside initialModeFilter="in_store" />
      </Story>

      <Story
        title="Mobile Viewport"
        description="Responsive coordination board stacked at compact viewport container width."
      >
        <div className="mx-auto max-w-sm">
          <StorePickupCurbside />
        </div>
      </Story>
    </>
  )
}
