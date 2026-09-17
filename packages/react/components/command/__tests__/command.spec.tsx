import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "../command";

describe("Command", () => {
  it('Command renders with data-slot="command"', () => {
    const { container } = render(<Command />);
    expect(container.querySelector('[data-slot="command"]')).toBeTruthy();
  });

  it("Command has data-uipkge", () => {
    const { container } = render(<Command />);
    expect(
      container
        .querySelector('[data-slot="command"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('CommandInput renders with data-slot="command-input"', () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search..." />
      </Command>,
    );
    expect(container.querySelector('[data-slot="command-input"]')).toBeTruthy();
  });

  it("CommandInput renders an input element", () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search..." />
      </Command>,
    );
    expect(
      container
        .querySelector('[data-slot="command-input"]')
        ?.tagName.toLowerCase(),
    ).toBe("input");
  });

  it('CommandList renders with data-slot="command-list"', () => {
    const { container } = render(
      <Command>
        <CommandList />
      </Command>,
    );
    expect(container.querySelector('[data-slot="command-list"]')).toBeTruthy();
  });

  it('CommandItem renders with data-slot="command-item"', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandItem value="a">Item A</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(container.querySelector('[data-slot="command-item"]')).toBeTruthy();
  });

  it("CommandItem has data-uipkge", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandItem value="a">Item A</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(
      container
        .querySelector('[data-slot="command-item"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('CommandGroup renders with data-slot="command-group"', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem value="a">Item A</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    expect(container.querySelector('[data-slot="command-group"]')).toBeTruthy();
  });

  it("CommandGroup renders heading text", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem value="a">Item A</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    expect(container.textContent).toContain("Suggestions");
  });

  it("CommandEmpty renders when no results", () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="a">Item A</CommandItem>
            <CommandItem value="b">Item B</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    const input = container.querySelector(
      '[data-slot="command-input"]',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "zzznomatch" } });
    expect(container.textContent).toContain("No results");
  });

  it("CommandItem renders children", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandItem value="a">Item A</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(
      container.querySelector('[data-slot="command-item"]')?.textContent,
    ).toContain("Item A");
  });

  it("renders multiple CommandItems", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem value="a">Item A</CommandItem>
            <CommandItem value="b">Item B</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    expect(
      container.querySelectorAll('[data-slot="command-item"]').length,
    ).toBe(2);
  });
});
