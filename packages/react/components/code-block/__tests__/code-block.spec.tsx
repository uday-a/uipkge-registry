import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { CodeBlock } from "../index";

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined);
  // @ts-expect-error test mock
  navigator.clipboard = { writeText };
});

afterEach(cleanup);

describe("CodeBlock", () => {
  it("renders a code element", () => {
    const { container } = render(<CodeBlock code="const x = 1" />);
    expect(container.querySelector("code")).toBeTruthy();
  });

  it('has data-slot="code-block" and data-uipkge', () => {
    const { container } = render(<CodeBlock code="const x = 1" />);
    const root = container.querySelector('[data-slot="code-block"]');
    expect(root).toBeTruthy();
    expect(root?.hasAttribute("data-uipkge")).toBe(true);
  });

  it("renders code content", () => {
    const { container } = render(<CodeBlock code="console.log(42)" />);
    expect(container.querySelector("code")?.textContent).toContain(
      "console.log(42)",
    );
  });

  it("shows language label in header", () => {
    const { container } = render(<CodeBlock code="x = 1" language="python" />);
    expect(container.textContent).toContain("python");
  });

  it("has a copy button", () => {
    const { container } = render(<CodeBlock code="copy this" />);
    const buttons = container.querySelectorAll("button");
    const copyBtn = Array.from(buttons).find((b) =>
      b.textContent?.includes("Copy"),
    );
    expect(copyBtn).toBeTruthy();
  });

  it("copy button copies code to clipboard", async () => {
    const { container } = render(<CodeBlock code="copy this" />);
    const buttons = container.querySelectorAll("button");
    const copyBtn = Array.from(buttons).find((b) =>
      b.textContent?.includes("Copy"),
    )!;
    fireEvent.click(copyBtn);
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith("copy this"));
  });

  it("hides header when showHeader is false", () => {
    const { container } = render(<CodeBlock code="x = 1" showHeader={false} />);
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  it("keeps code visible when the hidden header removes the disclosure control", () => {
    const { container } = render(
      <CodeBlock code="x = 1" showHeader={false} defaultExpanded={false} />,
    );
    expect(container.querySelector("code")).toBeVisible();
  });

  it("exposes disclosure state and the controlled code region", () => {
    const { getByRole } = render(
      <CodeBlock code="x = 1" language="typescript" />,
    );
    const toggle = getByRole("button", { name: "Hide code" });
    const region = getByRole("region", { name: "typescript code sample" });

    expect(region.id).toBeTruthy();
    expect(region).toHaveAttribute("tabindex", "0");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-controls", region.id);

    fireEvent.click(toggle);
    expect(getByRole("button", { name: "Show code" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(region).not.toBeVisible();
  });

  it("renders the supplied source text verbatim", () => {
    const code = "const x = 1  \n\n";
    const { container } = render(<CodeBlock code={code} />);
    expect(container.querySelector("code")?.textContent).toBe(code);
  });

  it("syntax-highlights recognized languages", async () => {
    const { container } = render(
      <CodeBlock code="const answer = 42" language="ts" />,
    );

    await vi.waitFor(() =>
      expect(
        container.querySelectorAll("[data-syntax-token]").length,
      ).toBeGreaterThan(1),
    );

    expect(
      container.querySelector("[data-syntax-token]")?.getAttribute("style"),
    ).toContain("--shiki-light");
  });

  it("keeps block elements outside the pre element", () => {
    const { container } = render(<CodeBlock code="x = 1" />);
    const childTags = Array.from(container.querySelector("pre")!.children).map(
      (child) => child.tagName,
    );
    expect(childTags).toEqual(["CODE"]);
  });

  it("shows an announced error when clipboard access fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    writeText.mockRejectedValueOnce(new Error("denied"));
    const { getByRole } = render(<CodeBlock code="copy this" />);

    fireEvent.click(getByRole("button", { name: "Copy" }));

    const failedButton = await vi.waitFor(() =>
      getByRole("button", { name: "Copy failed" }),
    );
    expect(failedButton.querySelector('[aria-live="polite"]')).toBeTruthy();
    warn.mockRestore();
  });
});
