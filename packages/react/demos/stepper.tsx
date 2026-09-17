import { useState } from "react";
import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import { Stepper } from "@react-registry/stepper";
import { CreditCard, Package, ShieldCheck, Truck, User } from "lucide-react";

const baseSteps = [
  { id: 1, title: "Account", icon: User },
  { id: 2, title: "Shipping", icon: Truck },
  { id: 3, title: "Confirm", icon: ShieldCheck },
];

const verticalSteps = [
  { id: 1, title: "Cart", description: "3 items" },
  { id: 2, title: "Address", description: "Where to ship" },
  { id: 3, title: "Payment", description: "Card or wallet" },
  { id: 4, title: "Review", description: "Place order" },
];

const errorSteps = [
  { id: 1, title: "Account" },
  { id: 2, title: "Payment", error: true },
  { id: 3, title: "Confirm" },
];

const disabledSteps = [
  { id: 1, title: "Sign up" },
  { id: 2, title: "Verify email" },
  { id: 3, title: "Subscribe", disabled: true },
  { id: 4, title: "Done" },
];

const descriptionSteps = [
  { id: 1, title: "Account", description: "Email + password" },
  { id: 2, title: "Profile", description: "Tell us about you" },
  { id: 3, title: "Plan", description: "Pick a tier" },
];

const wizardSteps = [
  { id: 1, title: "Details", icon: User },
  { id: 2, title: "Items", icon: Package },
  { id: 3, title: "Payment", icon: CreditCard },
  { id: 4, title: "Done", icon: ShieldCheck },
];

export default function StepperDemo() {
  const [step, setStep] = useState(2);
  const [wizardStep, setWizardStep] = useState(1);

  return (
    <>
      <Story
        title="Default"
        description="Horizontal stepper with icon indicators, titles, and connectors between steps."
      >
        <Stepper
          value={step}
          onValueChange={setStep}
          steps={baseSteps}
          className="max-w-md"
        />
      </Story>

      <Story
        title="Vertical orientation"
        description="orientation='vertical' stacks indicators top-to-bottom with connectors running between them."
      >
        <Stepper
          value={2}
          steps={verticalSteps}
          orientation="vertical"
          className="max-w-xs"
        />
      </Story>

      <Story
        title="Error state"
        description="A step with error: true switches its indicator to the destructive style."
      >
        <Stepper value={2} steps={errorSteps} className="max-w-md" />
      </Story>

      <Story
        title="Disabled step"
        description="A step with disabled: true is non-clickable and skipped during navigation."
      >
        <Stepper value={2} steps={disabledSteps} className="max-w-lg" />
      </Story>

      <Story
        title="With descriptions"
        description="Each step's description prop renders below the title in muted small text."
      >
        <Stepper value={2} steps={descriptionSteps} className="max-w-2xl" />
      </Story>

      <Story
        title="Programmatic v-model"
        description="Drive currentStep with external buttons; the stepper updates in lock-step with the model."
      >
        <div className="space-y-4">
          <Stepper
            value={wizardStep}
            onValueChange={setWizardStep}
            steps={wizardSteps}
            className="max-w-xl"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={wizardStep === 1}
              onClick={() => setWizardStep((s) => s - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              disabled={wizardStep === wizardSteps.length}
              onClick={() => setWizardStep((s) => s + 1)}
            >
              Next
            </Button>
            <span className="text-muted-foreground ml-2 text-xs">
              Step {wizardStep} of {wizardSteps.length}
            </span>
          </div>
        </div>
      </Story>
    </>
  );
}
