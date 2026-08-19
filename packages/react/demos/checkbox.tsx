import { useState } from "react";
import Story from "../../components/story/Story";
import { Checkbox, CheckboxGroup } from "@react-registry/checkbox";
import { Label } from "@react-registry/label";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Pear", value: "pear" },
  { label: "Orange", value: "orange", disabled: true },
];

const fruits = ["Apple", "Pear", "Orange"];
const allFruits = fruits.map((f) => f.toLowerCase());

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["apple"]);
  const [selectedFruits, setSelectedFruits] = useState<string[]>(["apple"]);

  const allChecked = selectedFruits.length === fruits.length;
  const isIndeterminate =
    selectedFruits.length > 0 && selectedFruits.length < fruits.length;
  const toggleAll = () => setSelectedFruits(allChecked ? [] : [...allFruits]);

  return (
    <>
      <Story title="States" description="All four interaction states.">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="c1"
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            />
            <Label htmlFor="c1">
              Accept terms (live: <code>{String(checked)}</code>)
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="c2" />
            <Label htmlFor="c2">Unchecked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="c3" disabled />
            <Label htmlFor="c3" className="text-muted-foreground">
              Disabled
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="c4" defaultChecked disabled />
            <Label htmlFor="c4" className="text-muted-foreground">
              Disabled checked
            </Label>
          </div>
        </div>
      </Story>

      <Story
        title="In a list"
        description="Common pattern for preference toggles."
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="t1" defaultChecked />
            <Label htmlFor="t1">Subscribe to newsletter</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="t2" />
            <Label htmlFor="t2">Allow analytics</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="t3" />
            <Label htmlFor="t3">Receive marketing emails</Label>
          </div>
        </div>
      </Story>

      <Story
        title="Group with options"
        description="CheckboxGroup renders checkboxes from an options array."
      >
        <CheckboxGroup
          value={selectedOptions}
          onValueChange={setSelectedOptions}
          options={options}
          label="Select fruits"
        />
      </Story>

      <Story
        title="Check all / Uncheck all"
        description="Master checkbox controls all items with indeterminate state."
      >
        <div className="space-y-2">
          <Checkbox
            checked={allChecked}
            indeterminate={isIndeterminate}
            label="Check all"
            onCheckedChange={toggleAll}
          />
          <div className="ml-6 space-y-2">
            <CheckboxGroup
              value={selectedFruits}
              onValueChange={setSelectedFruits}
            >
              {fruits.map((fruit) => (
                <Checkbox
                  key={fruit}
                  value={fruit.toLowerCase()}
                  label={fruit}
                />
              ))}
            </CheckboxGroup>
          </div>
        </div>
      </Story>

      <Story
        title="Group disabled"
        description="Disabled group prevents interaction with all checkboxes."
      >
        <CheckboxGroup
          defaultValue={["b"]}
          disabled
          options={[
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
            { label: "Option C", value: "c" },
          ]}
          label="Disabled group"
        />
      </Story>

      <Story
        title="Group inline layout"
        description="Horizontal arrangement with the inline prop."
      >
        <CheckboxGroup
          defaultValue={["a", "c"]}
          inline
          options={[
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
            { label: "Option C", value: "c" },
          ]}
        />
      </Story>

      <Story
        title="Group with name"
        description="Name attribute for form submission."
      >
        <CheckboxGroup
          defaultValue={["a"]}
          name="my-checkbox-group"
          options={[
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
          ]}
          label="Named group"
        />
      </Story>
    </>
  );
}
