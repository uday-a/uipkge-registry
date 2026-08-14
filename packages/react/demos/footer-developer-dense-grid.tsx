import { FooterDeveloperDenseGrid } from '@/components/blocks/footer-developer-dense-grid'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Dense multi-column developer footer with edge telemetry status beacon">
      <div className="w-full">
        <FooterDeveloperDenseGrid />
      </div>
    </Story>
  )
}
