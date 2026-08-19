import { useState } from "react";
import Story from "../../components/story/Story";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@react-registry/input";
import { Label } from "@react-registry/label";
import { Copy, DollarSign, Mail, Search } from "lucide-react";

export default function InputDemo() {
  const [text, setText] = useState("");

  return (
    <>
      <Story
        title="Default"
        description="Two-way bound with value/onChange. Plain text input with label."
      >
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            Live: <code className="text-foreground">{text || "—"}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Sizes"
        description="Three heights: small, middle (default), and large."
      >
        <div className="grid max-w-sm gap-3">
          <Input size="small" placeholder="Small input" />
          <Input size="middle" placeholder="Middle input" />
          <Input size="large" placeholder="Large input" />
        </div>
      </Story>

      <Story
        title="Variants"
        description="Outlined, filled, and borderless backgrounds."
      >
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Outlined (default)" variant="outlined" />
          <Input placeholder="Filled" variant="filled" />
          <Input placeholder="Borderless" variant="borderless" />
        </div>
      </Story>

      <Story
        title="Status"
        description="Error and warning visual states via the status prop."
      >
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Error state" status="error" />
          <Input placeholder="Warning state" status="warning" />
          <Input
            placeholder="Error with value"
            status="error"
            defaultValue="invalid"
          />
        </div>
      </Story>

      <Story
        title="Prefix & Suffix"
        description="String or node content rendered inside the input wrapper."
      >
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Username" prefix="@" />
          <Input placeholder="0.00" suffix="USD" />
          <Input
            placeholder="Search..."
            prefix={<Search className="size-4" />}
          />
          <Input
            placeholder="you@example.com"
            suffix={<Mail className="size-4" />}
          />
        </div>
      </Story>

      <Story
        title="Addon before & after"
        description="Input group styling with addon segments."
      >
        <div className="grid max-w-sm gap-3">
          <Input
            placeholder="website"
            addonBefore="https://"
            addonAfter=".com"
          />
          <Input
            placeholder="0.00"
            addonBefore={<DollarSign className="size-4" />}
            addonAfter={<span className="text-xs">USD</span>}
          />
        </div>
      </Story>

      <Story
        title="Allow clear"
        description="Shows an X icon when the input has value and is focused or hovered."
      >
        <div className="grid max-w-sm gap-3">
          <Input
            placeholder="Type something..."
            defaultValue="Clear me"
            allowClear
          />
        </div>
      </Story>

      <Story
        title="Show count"
        description="Displays character count when maxLength is set."
      >
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Max 20 characters..." maxLength={20} showCount />
        </div>
      </Story>

      <Story
        title="Password toggle"
        description="Eye icon to toggle password visibility."
      >
        <div className="grid max-w-sm gap-3">
          <Input
            type="password"
            placeholder="Password"
            defaultValue="secret123"
            showPasswordToggle
          />
          <Input
            type="password"
            placeholder="Large password"
            size="large"
            defaultValue="secret123"
            showPasswordToggle
          />
        </div>
      </Story>

      <Story
        title="Disabled & Readonly"
        description="Non-interactive states with full styling."
      >
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Readonly" readOnly defaultValue="Cannot edit" />
          <Input placeholder="Disabled with prefix" prefix="@" disabled />
        </div>
      </Story>

      <Story
        title="Composite Input Groups"
        description="Seamless input wrappers with prefix addons, copy buttons, and action triggers."
      >
        <div className="grid max-w-sm gap-3">
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <Input placeholder="uipkge.dev" />
            <InputGroupButton variant="ghost">
              <Copy className="size-3.5" />
            </InputGroupButton>
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <Input placeholder="Search packages..." />
            <InputGroupButton variant="default">Search</InputGroupButton>
          </InputGroup>
        </div>
      </Story>
    </>
  );
}
