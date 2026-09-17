import { HeroDeveloperTerminal } from '@/components/blocks/hero-developer-terminal'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Developer hero with live CLI terminal sandbox and interactive preset runners">
      <div className="w-full">
        <HeroDeveloperTerminal />
      </div>
    </Story>
  )
}
