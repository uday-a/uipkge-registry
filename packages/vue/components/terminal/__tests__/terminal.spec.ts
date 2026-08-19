import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Terminal } from "../index";

const lines = [
  { prompt: "$", command: "npm install", output: "added 42 packages" },
  { prompt: "$", command: "npm run build" },
  { type: "output" as const, output: "Build complete" },
];

describe("Terminal", () => {
  it('renders container with data-slot="terminal"', () => {
    const w = mount(Terminal, { props: { lines }, attachTo: document.body });
    expect(w.find('[data-slot="terminal"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(Terminal, { props: { lines }, attachTo: document.body });
    expect(
      w.find('[data-slot="terminal"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('renders terminal lines with data-slot="terminal-line"', () => {
    const w = mount(Terminal, { props: { lines }, attachTo: document.body });
    expect(w.findAll('[data-slot="terminal-line"]').length).toBe(3);
    w.unmount();
  });

  it('renders command lines with data-slot="terminal-command"', () => {
    const w = mount(Terminal, { props: { lines }, attachTo: document.body });
    const commands = w.findAll('[data-slot="terminal-command"]');
    expect(commands.length).toBe(2);
    expect(commands[0].text()).toContain("npm install");
    w.unmount();
  });

  it('renders output with data-slot="terminal-output"', () => {
    const w = mount(Terminal, { props: { lines }, attachTo: document.body });
    const outputs = w.findAll('[data-slot="terminal-output"]');
    expect(outputs.length).toBe(2);
    expect(outputs[0].text()).toContain("added 42 packages");
    w.unmount();
  });

  it('applies data-theme="dark" by default', () => {
    const w = mount(Terminal, { props: { lines }, attachTo: document.body });
    expect(w.find('[data-slot="terminal"]').attributes("data-theme")).toBe(
      "dark",
    );
    w.unmount();
  });

  it('applies data-theme="light" when theme prop is set', () => {
    const w = mount(Terminal, {
      props: { lines, theme: "light" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="terminal"]').attributes("data-theme")).toBe(
      "light",
    );
    w.unmount();
  });

  it("renders the title in the title bar", () => {
    const w = mount(Terminal, {
      props: { lines, title: "zsh" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("zsh");
    w.unmount();
  });
});
