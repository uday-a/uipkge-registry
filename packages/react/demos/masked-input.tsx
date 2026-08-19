import Story from "../../components/story/Story";
import { Label } from "@react-registry/label";
import { MaskedInput } from "@react-registry/masked-input";
import { useState } from "react";

export default function MaskedInputDemo() {
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [ssn, setSsn] = useState("");
  const [card, setCard] = useState("");
  const [custom, setCustom] = useState("");
  const [rawOnly, setRawOnly] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <>
      <Story title="Phone" description="US phone format: (###) ###-####">
        <div className="max-w-sm">
          <Label>Phone Number</Label>
          <MaskedInput
            value={phone}
            onValueChange={setPhone}
            mask="(###) ###-####"
            className="mt-1.5"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Value: <code className="text-foreground">{phone || "—"}</code>
          </p>
        </div>
      </Story>

      <Story title="Date" description="Date format: ##/##/####">
        <div className="max-w-sm">
          <Label>Date of Birth</Label>
          <MaskedInput
            value={date}
            onValueChange={setDate}
            mask="##/##/####"
            placeholderChar="0"
            className="mt-1.5"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Value: <code className="text-foreground">{date || "—"}</code>
          </p>
        </div>
      </Story>

      <Story title="SSN" description="Social Security format: ###-##-####">
        <div className="max-w-sm">
          <Label>SSN</Label>
          <MaskedInput
            value={ssn}
            onValueChange={setSsn}
            mask="###-##-####"
            className="mt-1.5"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Value: <code className="text-foreground">{ssn || "—"}</code>
          </p>
        </div>
      </Story>

      <Story title="Credit Card" description="Card format: #### #### #### ####">
        <div className="max-w-sm">
          <Label>Credit Card</Label>
          <MaskedInput
            value={card}
            onValueChange={setCard}
            mask="#### #### #### ####"
            className="mt-1.5"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Value: <code className="text-foreground">{card || "—"}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Custom Pattern"
        description="License plate format: AAA-####"
      >
        <div className="max-w-sm">
          <Label>License Plate</Label>
          <MaskedInput
            value={custom}
            onValueChange={setCustom}
            mask="AAA-####"
            replacement="A"
            className="mt-1.5"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Value: <code className="text-foreground">{custom || "—"}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Without Mask Display"
        description="Only shows typed characters, no placeholder underscores."
      >
        <div className="max-w-sm">
          <Label>Phone (no mask display)</Label>
          <MaskedInput
            value={rawOnly}
            onValueChange={setRawOnly}
            mask="(###) ###-####"
            showMask={false}
            className="mt-1.5"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Value: <code className="text-foreground">{rawOnly || "—"}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Completed Event"
        description="Emits 'complete' when the mask is fully filled."
      >
        <div className="max-w-sm">
          <Label>OTP Code</Label>
          <MaskedInput
            value={otp}
            onValueChange={setOtp}
            mask="######"
            showMask={false}
            placeholderChar=""
            onComplete={(v) => alert("Completed: " + v)}
            className="mt-1.5"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Type 6 digits to trigger complete event
          </p>
        </div>
      </Story>

      <Story title="Disabled & Readonly" description="Non-interactive states.">
        <div className="max-w-sm space-y-2">
          <MaskedInput
            mask="(###) ###-####"
            defaultValue="(555) 123-4567"
            disabled
          />
          <MaskedInput
            mask="(###) ###-####"
            defaultValue="(555) 999-8888"
            readOnly
          />
        </div>
      </Story>
    </>
  );
}
