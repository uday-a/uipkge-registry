import Story from "../../components/story/Story";
import { useState } from "react";
import { Label } from "@react-registry/label";
import {
  RadioButton,
  RadioGroup,
  RadioGroupItem,
} from "@react-registry/radio-group";

const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry", disabled: true },
  { label: "Date", value: "date" },
];

const planOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export default function RadioGroupDemo() {
  const [value, setValue] = useState("comfortable");
  const [buttonValue, setButtonValue] = useState("b");
  const [solidValue, setSolidValue] = useState("weekly");
  const [optionsValue, setOptionsValue] = useState("apple");
  const [disabledValue, setDisabledValue] = useState("option1");

  return (
    <>
      <Story
        title="Default"
        description="Single-select group of mutually exclusive options."
      >
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="r1" value="default" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="r2" value="comfortable" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="r3" value="compact" />
            <Label htmlFor="r3">Compact</Label>
          </div>
        </RadioGroup>
      </Story>

      <Story
        title="Options prop"
        description="Render radios automatically from an options array."
      >
        <RadioGroup
          value={optionsValue}
          onValueChange={setOptionsValue}
          options={fruitOptions}
        />
      </Story>

      <Story
        title="Button style — outline"
        description="Button-styled radios with outline variant, matching Ant Design Radio.Button."
      >
        <RadioGroup
          value={buttonValue}
          onValueChange={setButtonValue}
          optionType="button"
          buttonVariant="outline"
          orientation="horizontal"
        >
          <RadioButton value="a" label="Hangzhou" />
          <RadioButton value="b" label="Shanghai" />
          <RadioButton value="c" label="Beijing" />
          <RadioButton value="d" label="Chengdu" />
        </RadioGroup>
      </Story>

      <Story
        title="Button style — solid"
        description="Filled background when checked."
      >
        <RadioGroup
          value={solidValue}
          onValueChange={setSolidValue}
          optionType="button"
          buttonVariant="solid"
          orientation="horizontal"
        >
          <RadioButton value="daily" label="Daily" />
          <RadioButton value="weekly" label="Weekly" />
          <RadioButton value="monthly" label="Monthly" />
        </RadioGroup>
      </Story>

      <Story
        title="Button sizes"
        description="Small, middle (default), and large button radios."
      >
        <div className="space-y-3">
          <RadioGroup
            value={buttonValue}
            onValueChange={setButtonValue}
            optionType="button"
            size="small"
            orientation="horizontal"
          >
            <RadioButton value="a" label="Small" />
            <RadioButton value="b" label="Button" />
          </RadioGroup>
          <RadioGroup
            value={buttonValue}
            onValueChange={setButtonValue}
            optionType="button"
            size="middle"
            orientation="horizontal"
          >
            <RadioButton value="a" label="Middle" />
            <RadioButton value="b" label="Button" />
          </RadioGroup>
          <RadioGroup
            value={buttonValue}
            onValueChange={setButtonValue}
            optionType="button"
            size="large"
            orientation="horizontal"
          >
            <RadioButton value="a" label="Large" />
            <RadioButton value="b" label="Button" />
          </RadioGroup>
        </div>
      </Story>

      <Story
        title="Button group vertical"
        description="Button radios stacked vertically."
      >
        <RadioGroup
          value={solidValue}
          onValueChange={setSolidValue}
          optionType="button"
          buttonVariant="solid"
          orientation="vertical"
        >
          <RadioButton value="daily" label="Daily digest" />
          <RadioButton value="weekly" label="Weekly summary" />
          <RadioButton value="monthly" label="Monthly report" />
        </RadioGroup>
      </Story>

      <Story
        title="Button group with options"
        description="Button style rendered automatically from options."
      >
        <RadioGroup
          value={solidValue}
          onValueChange={setSolidValue}
          optionType="button"
          buttonVariant="solid"
          orientation="horizontal"
          options={planOptions}
        />
      </Story>

      <Story
        title="Group disabled"
        description="Disabling the group disables all children automatically."
      >
        <RadioGroup
          value={disabledValue}
          onValueChange={setDisabledValue}
          disabled
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem id="d1" value="option1" />
            <Label htmlFor="d1">Option 1</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="d2" value="option2" />
            <Label htmlFor="d2">Option 2</Label>
          </div>
        </RadioGroup>
      </Story>

      <Story
        title="Disabled button group"
        description="Disabled state works with button-style radios too."
      >
        <RadioGroup
          value={buttonValue}
          onValueChange={setButtonValue}
          optionType="button"
          disabled
          orientation="horizontal"
        >
          <RadioButton value="a" label="Enabled look" />
          <RadioButton value="b" label="But disabled" />
        </RadioGroup>
      </Story>
    </>
  );
}
