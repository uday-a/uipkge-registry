import Story from '../../components/story/Story'
import { FormLayouts } from '@react-registry-blocks/form-layouts/FormLayouts'

export default function FormLayoutsDemo() {
  return (
    <>
      <Story title="Default" description="Full create-project form with slug preview, char counter and sticky footer.">
        <FormLayouts />
      </Story>

      <Story title="Compact" description="The same form constrained to a narrow column.">
        <div className="max-w-sm">
          <FormLayouts />
        </div>
      </Story>
    </>
  )
}
