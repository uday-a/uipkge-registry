import Story from '../../components/story/Story'
import { Phone } from '@react-registry/phone'
import hrmsScreenshot from '../../assets/templates/hrms.jpeg?url'
import trackingScreenshot from '../../assets/templates/tracking.jpeg?url'

export default function PhoneDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Story
        title="Marketing screenshots"
        description="Place any image edge to edge, choose its crop with standard object-position classes, and layer marketing copy above it."
      >
        <div className="grid place-items-center gap-12 py-10 lg:grid-cols-2">
          <Phone model="iphone-17-pro" color="deep-blue" showStatusBar={false} showHomeIndicator={false}>
            <img
              src={hrmsScreenshot}
              alt="HR management dashboard"
              className="absolute inset-0 size-full object-cover object-left"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 text-white">
              <p className="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">Workforce</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">Your team, in focus.</p>
            </div>
          </Phone>

          <Phone model="galaxy-s26-ultra" color="cobalt-violet" showStatusBar={false} showNavBar={false}>
            <img
              src={trackingScreenshot}
              alt="Shipment tracking dashboard"
              className="absolute inset-0 size-full object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 text-white">
              <p className="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">Live tracking</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">Every shipment. One view.</p>
            </div>
          </Phone>
        </div>
      </Story>

      <Story
        title="Device chrome"
        description="Official outer proportions, model-specific bezels, cutouts, controls, and gesture indicators."
      >
        <div className="flex flex-wrap items-end justify-center gap-12 py-10">
          <Phone model="iphone-17-pro" color="cosmic-orange">
            <div className="bg-background flex h-full flex-col px-4 pt-14 pb-7">
              <p className="text-muted-foreground text-xs">Good morning</p>
              <h3 className="text-xl font-semibold tracking-tight">Alex Morgan</h3>
              <div className="bg-primary text-primary-foreground mt-5 rounded-[1.4rem] p-4">
                <p className="text-primary-foreground/70 text-xs">Available balance</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">$4,280.00</p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {['Coffee shop', 'Metro card', 'Payroll'].map((item) => (
                  <div
                    key={item}
                    className="bg-card flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs"
                  >
                    <span>{item}</span>
                    <span className="text-muted-foreground tabular-nums">$12.40</span>
                  </div>
                ))}
              </div>
            </div>
          </Phone>

          <Phone model="galaxy-s26-ultra" color="titanium-black">
            <div className="bg-muted/40 flex h-full flex-col px-4 pt-12 pb-7">
              <p className="text-muted-foreground text-xs">Tuesday, 11 July</p>
              <h3 className="text-xl font-semibold tracking-tight">Schedule</h3>
              <div className="mt-5 flex flex-col gap-2">
                {[
                  ['09:00', 'Standup'],
                  ['11:30', 'Design review'],
                  ['15:00', 'Ship checklist'],
                ].map(([time, title]) => (
                  <div key={title} className="bg-card rounded-[1.2rem] border p-3">
                    <span className="text-muted-foreground text-xs tabular-nums">{time}</span>
                    <p className="mt-1 text-sm font-medium">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </Phone>
        </div>
      </Story>

      <Story title="Finishes" description="Model-specific metal finishes preserve the same calibrated geometry.">
        <div className="flex flex-wrap items-end justify-center gap-7 py-8">
          <Phone model="iphone-17-pro" color="cosmic-orange" size="sm" />
          <Phone model="iphone-17-pro" color="deep-blue" size="sm" />
          <Phone model="iphone-17-pro" color="silver" size="sm" />
          <Phone model="galaxy-s26-ultra" color="titanium-black" size="sm" />
          <Phone model="galaxy-s26-ultra" color="cobalt-violet" size="sm" />
        </div>
      </Story>
    </div>
  )
}
