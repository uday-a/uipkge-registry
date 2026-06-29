import Story from '../../components/story/Story'
import { useState } from 'react'
import { Button } from '@react-registry/button'
import { Tour, type TourStep } from '@react-registry/tour'

const steps1: TourStep[] = [
  { target: '#tour-target-a', title: 'Welcome', description: 'This is the first stop.' },
  { target: '#tour-target-b', title: 'Search bar', description: 'Find anything from here.' },
  { target: '#tour-target-c', title: 'Settings', description: 'Configure your account.' },
  { target: '#tour-target-d', title: 'Done!', description: 'You finished the tour.' },
]

const steps2: TourStep[] = [
  {
    target: '#tour-target-cover-a',
    title: 'Cover image',
    description: 'A short marketing intro to a feature.',
    cover: 'https://placehold.co/600x180/0ea5e9/white?text=Cover',
  },
  {
    target: '#tour-target-cover-b',
    title: 'Try it',
    description: 'Use this control to begin.',
  },
]

const steps3: TourStep[] = [
  { title: 'Welcome', description: 'A centered intro step (no target).', mask: true },
  { target: '#tour-target-centered', title: 'Then a real target', description: 'Now we anchor.' },
]

const steps4: TourStep[] = [
  {
    target: '#tour-long-a',
    title: 'Step 1 of 6',
    description: 'A longer tour with six stops, useful for full onboarding flows.',
  },
  { target: '#tour-long-b', title: 'Step 2 of 6', description: 'Each step can reference any selector on the page.' },
  {
    target: '#tour-long-c',
    title: 'Step 3 of 6',
    description: 'Mid-tour stops can re-anchor the user to a new area of the UI.',
  },
  {
    target: '#tour-long-d',
    title: 'Step 4 of 6',
    description: 'Use longer descriptions for steps that introduce new concepts.',
  },
  { target: '#tour-long-e', title: 'Step 5 of 6', description: 'Nearly there — one more checkpoint.' },
  { target: '#tour-long-f', title: 'Done', description: 'Six stops in, the user has seen the whole surface.' },
]

const steps5: TourStep[] = [
  {
    target: '#tour-mask-a',
    title: 'Masked target',
    description: 'The mask cuts out a hole around the target so the rest of the page is dimmed.',
    mask: true,
  },
  {
    target: '#tour-mask-b',
    title: 'No mask',
    description:
      'mask=false leaves the page un-dimmed for this step — useful when the surrounding context still matters.',
    mask: false,
  },
]

export default function TourDemo() {
  const [open1, setOpen1] = useState(false)
  const [step1, setStep1] = useState(0)
  const [open2, setOpen2] = useState(false)
  const [step2, setStep2] = useState(0)
  const [open3, setOpen3] = useState(false)
  const [step3, setStep3] = useState(0)
  const [open4, setOpen4] = useState(false)
  const [step4, setStep4] = useState(0)
  const [open5, setOpen5] = useState(false)
  const [step5, setStep5] = useState(0)

  return (
    <>
      <Story
        title="Basic 4-step tour"
        description="Four stops anchored to four buttons. Press Esc or the close button to exit."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button id="tour-target-a">Step 1 target</Button>
            <Button id="tour-target-b" variant="outline">
              Step 2 target
            </Button>
            <Button id="tour-target-c" variant="secondary">
              Step 3 target
            </Button>
            <Button id="tour-target-d" variant="ghost">
              Step 4 target
            </Button>
          </div>
          <Button
            onClick={() => {
              setOpen1(true)
              setStep1(0)
            }}
          >
            Start tour
          </Button>
          <Tour open={open1} current={step1} steps={steps1} onOpenChange={setOpen1} onCurrentChange={setStep1} />
        </div>
      </Story>

      <Story
        title="Cover image + primary type"
        description="A step can include a cover image. type='primary' inverts the card style."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button id="tour-target-cover-a">Anchor 1</Button>
            <Button id="tour-target-cover-b" variant="outline">
              Anchor 2
            </Button>
          </div>
          <Button
            onClick={() => {
              setOpen2(true)
              setStep2(0)
            }}
          >
            Start tour
          </Button>
          <Tour
            open={open2}
            current={step2}
            steps={steps2}
            type="primary"
            onOpenChange={setOpen2}
            onCurrentChange={setStep2}
          />
        </div>
      </Story>

      <Story
        title="Centered (no target) step"
        description="A step with no target renders as a centered modal-style card."
      >
        <div className="space-y-4">
          <Button id="tour-target-centered" variant="outline">
            Anchor for step 2
          </Button>
          <Button
            onClick={() => {
              setOpen3(true)
              setStep3(0)
            }}
          >
            Start tour
          </Button>
          <Tour open={open3} current={step3} steps={steps3} onOpenChange={setOpen3} onCurrentChange={setStep3} />
        </div>
      </Story>

      <Story
        title="Long onboarding tour (6 steps)"
        description="Walk users through a larger surface. The progress indicator + Skip affordance keep cognitive load manageable past 4 stops."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button id="tour-long-a">Stop 1</Button>
            <Button id="tour-long-b" variant="outline">
              Stop 2
            </Button>
            <Button id="tour-long-c" variant="secondary">
              Stop 3
            </Button>
            <Button id="tour-long-d" variant="ghost">
              Stop 4
            </Button>
            <Button id="tour-long-e">Stop 5</Button>
            <Button id="tour-long-f" variant="outline">
              Stop 6
            </Button>
          </div>
          <Button
            onClick={() => {
              setOpen4(true)
              setStep4(0)
            }}
          >
            Start 6-step tour
          </Button>
          <Tour open={open4} current={step4} steps={steps4} onOpenChange={setOpen4} onCurrentChange={setStep4} />
        </div>
      </Story>

      <Story
        title="Mask on / off per step"
        description="Each step can opt in or out of the page dim. Use the dim when the target is what matters; drop it when the surrounding context tells the story."
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button id="tour-mask-a">Masked</Button>
            <Button id="tour-mask-b" variant="outline">
              Unmasked
            </Button>
          </div>
          <Button
            onClick={() => {
              setOpen5(true)
              setStep5(0)
            }}
          >
            Start tour
          </Button>
          <Tour open={open5} current={step5} steps={steps5} onOpenChange={setOpen5} onCurrentChange={setStep5} />
        </div>
      </Story>
    </>
  )
}
