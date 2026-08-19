import { useState } from "react";
import Story from "../../components/story/Story";
import { AdvanceSelect } from "@react-registry/advance-select";
import {
  NativeSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@react-registry/select";

export default function SelectDemo() {
  const [fruit, setFruit] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [role, setRole] = useState<string>();
  const [skill, setSkill] = useState<string>();
  const [tz, setTz] = useState<string>();
  const [disabledTrigger, setDisabledTrigger] = useState<string>();
  const [fruits, setFruits] = useState<string[]>([]);
  const fruitOptions = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Durian", value: "durian" },
    { label: "Elderberry", value: "elderberry" },
  ];

  return (
    <>
      <Story
        title="Default"
        description="Single-select dropdown with a placeholder and basic options."
      >
        <Select value={fruit} onValueChange={setFruit}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </Select>
      </Story>

      <Story
        title="Grouped with labels"
        description="Multiple SelectGroups, each with a SelectLabel header."
      >
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Choose a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="spain">Spain</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value="japan">Japan</SelectItem>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="korea">South Korea</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Story>

      <Story
        title="Disabled item"
        description="Individual items can be disabled via the disabled prop."
      >
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pick a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin" disabled>
              Admin (locked)
            </SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>
      </Story>

      <Story
        title="With separator"
        description="Use SelectSeparator to visually split groups inside the popover."
      >
        <Select value={skill} onValueChange={setSkill}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Pick a skill level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectSeparator />
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </Story>

      <Story
        title="Long list with scroll buttons"
        description="When content exceeds available height, scroll up/down buttons render automatically."
      >
        <Select value={tz} onValueChange={setTz}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Pick a timezone" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="utc-08">(UTC-08) Pacific Time</SelectItem>
              <SelectItem value="utc-07">(UTC-07) Mountain Time</SelectItem>
              <SelectItem value="utc-06">(UTC-06) Central Time</SelectItem>
              <SelectItem value="utc-05">(UTC-05) Eastern Time</SelectItem>
              <SelectItem value="utc-04">(UTC-04) Atlantic Time</SelectItem>
              <SelectItem value="utc-03">(UTC-03) Buenos Aires</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="utc+00">(UTC+00) London</SelectItem>
              <SelectItem value="utc+01">(UTC+01) Paris</SelectItem>
              <SelectItem value="utc+02">(UTC+02) Athens</SelectItem>
              <SelectItem value="utc+03">(UTC+03) Moscow</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value="utc+05:30">(UTC+05:30) Mumbai</SelectItem>
              <SelectItem value="utc+07">(UTC+07) Bangkok</SelectItem>
              <SelectItem value="utc+08">(UTC+08) Singapore</SelectItem>
              <SelectItem value="utc+09">(UTC+09) Tokyo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Story>

      <Story
        title="Disabled trigger"
        description="Pass disabled to the root to lock the entire control."
      >
        <Select
          value={disabledTrigger}
          onValueChange={setDisabledTrigger}
          disabled
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Locked" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
            <SelectItem value="b">B</SelectItem>
          </SelectContent>
        </Select>
      </Story>

      <Story
        title="Multi-select"
        description="Radix Select is single-value only. Use AdvanceSelect with mode='multiple' for the same string[] model Vue gets from Select multiple."
      >
        <div className="space-y-2">
          <AdvanceSelect
            value={fruits}
            onValueChange={setFruits}
            mode="multiple"
            options={fruitOptions}
            placeholder="Pick fruits"
            className="w-56"
          />
          <p className="text-muted-foreground text-xs">
            Selected:{" "}
            <code className="text-foreground">
              {fruits.length ? fruits.join(", ") : "—"}
            </code>
          </p>
        </div>
      </Story>

      <Story
        title="Native Select"
        description="Zero-JS lightweight HTML select styled with tokens and chevron for mobile & fast forms."
      >
        <div className="grid max-w-xs gap-3">
          <NativeSelect
            defaultValue="banana"
            options={[
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
              { label: "Cherry", value: "cherry" },
              {
                label: "Dragonfruit (Sold out)",
                value: "dragonfruit",
                disabled: true,
              },
            ]}
          />
        </div>
      </Story>
    </>
  );
}
