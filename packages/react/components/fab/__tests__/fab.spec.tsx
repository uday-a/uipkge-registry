import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Plus } from "lucide-react";
import { Fab } from "../index";

afterEach(cleanup);

describe("Fab", () => {
  it("renders a button element", () => {
    const { container } = render(<Fab />);
    expect(container.querySelector("button")).toBeTruthy();
  });

  it('has data-slot="fab" and data-uipkge', () => {
    const { container } = render(<Fab />);
    const el = container.querySelector('[data-slot="fab"]');
    expect(el).toBeTruthy();
    expect(el?.hasAttribute("data-uipkge")).toBe(true);
  });

  it("applies data-position attribute", () => {
    const { container } = render(<Fab position="top-left" />);
    expect(
      container
        .querySelector('[data-slot="fab"]')
        ?.getAttribute("data-position"),
    ).toBe("top-left");
  });

  it("applies data-variant attribute", () => {
    const { container } = render(<Fab variant="destructive" />);
    expect(
      container
        .querySelector('[data-slot="fab"]')
        ?.getAttribute("data-variant"),
    ).toBe("destructive");
  });

  it("renders icon from children", () => {
    const { container } = render(
      <Fab>
        <Plus />
      </Fab>,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Fab onClick={onClick} />);
    fireEvent.click(container.querySelector("button")!);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    const { container } = render(<Fab disabled onClick={onClick} />);
    fireEvent.click(container.querySelector("button")!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
