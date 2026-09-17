import Story from '../../components/story/Story'
import { PromptPlayground } from '@react-registry-blocks/prompt-playground/PromptPlayground'

export default function PromptPlaygroundDemo() {
  return (
    <Story
      title="Prompt Playground"
      description="AI model prompt engineering studio & parameter tuner. Features model selection, preset switching, system instructions, user input, temperature, max tokens, top-p sliders, JSON output mode, streaming simulation, token & cost calculation, and raw payload inspection."
    >
      <PromptPlayground />
    </Story>
  )
}
