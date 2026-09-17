import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "../index";

function mountCommand() {
  return mount(
    {
      template:
        '<Command><CommandInput placeholder="Search..." /><CommandList><CommandEmpty>No results</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem value="a">Item A</CommandItem><CommandItem value="b">Item B</CommandItem></CommandGroup></CommandList></Command>',
      components: {
        Command,
        CommandInput,
        CommandList,
        CommandItem,
        CommandGroup,
        CommandEmpty,
      },
    },
    { attachTo: document.body },
  );
}

describe("Command", () => {
  it('renders with data-slot="command"', () => {
    const w = mountCommand();
    expect(w.find('[data-slot="command"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountCommand();
    expect(
      w.find('[data-slot="command"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('CommandInput renders with data-slot="command-input"', () => {
    const w = mountCommand();
    expect(w.find('[data-slot="command-input"]').exists()).toBe(true);
    w.unmount();
  });

  it("CommandInput renders a search input", () => {
    const w = mountCommand();
    const input = w.find('[data-slot="command-input"]');
    expect(input.element.tagName.toLowerCase()).toBe("input");
    expect(input.attributes("type")).toBe("text");
    w.unmount();
  });

  it('CommandList renders with data-slot="command-list"', () => {
    const w = mountCommand();
    expect(w.find('[data-slot="command-list"]').exists()).toBe(true);
    w.unmount();
  });

  it('CommandItem renders with data-slot="command-item"', () => {
    const w = mountCommand();
    expect(w.findAll('[data-slot="command-item"]').length).toBe(2);
    w.unmount();
  });

  it("CommandItem has data-uipkge", () => {
    const w = mountCommand();
    expect(
      w.find('[data-slot="command-item"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('CommandGroup renders with data-slot="command-group"', () => {
    const w = mountCommand();
    expect(w.find('[data-slot="command-group"]').exists()).toBe(true);
    w.unmount();
  });

  it("CommandGroup renders heading text", () => {
    const w = mountCommand();
    expect(w.find('[data-slot="command-group-heading"]').text()).toContain(
      "Suggestions",
    );
    w.unmount();
  });

  it("CommandEmpty renders when no results match", async () => {
    const w = mountCommand();
    const input = w.find('[data-slot="command-input"]');
    await input.setValue("zzz");
    expect(w.find('[data-slot="command-empty"]').exists()).toBe(true);
    expect(w.find('[data-slot="command-empty"]').text()).toContain(
      "No results",
    );
    w.unmount();
  });

  it("CommandItem renders slot content", () => {
    const w = mountCommand();
    const items = w.findAll('[data-slot="command-item"]');
    expect(items[0].text()).toContain("Item A");
    expect(items[1].text()).toContain("Item B");
    w.unmount();
  });
});
