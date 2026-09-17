import { describe, it, expect, afterEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import {
  ScrollSpy,
  ScrollSpyTitle,
  ScrollSpyList,
  ScrollSpyIndicator,
  ScrollSpyItem,
  ScrollSpyLink,
  ScrollSpyStepper,
} from "../index";

afterEach(async () => {
  await act(async () => {});
  cleanup();
});

describe("ScrollSpy (React)", () => {
  it('renders nav element with data-slot="scroll-spy"', () => {
    const { container } = render(<ScrollSpy />);
    expect(container.querySelector('[data-slot="scroll-spy"]')).toBeTruthy();
    expect(container.querySelector('nav[data-slot="scroll-spy"]')).toBeTruthy();
  });

  it("has data-uipkge on nav", () => {
    const { container } = render(<ScrollSpy />);
    expect(
      container.querySelector('[data-slot="scroll-spy"][data-uipkge]'),
    ).toBeTruthy();
  });

  it("renders ScrollSpyLink children from items prop", () => {
    const { container } = render(
      <ScrollSpy
        items={[
          { href: "#section-1", title: "Section 1" },
          { href: "#section-2", title: "Section 2" },
        ]}
      />,
    );
    const links = container.querySelectorAll('[data-slot="scroll-spy-link"]');
    expect(links.length).toBe(2);
  });

  it("renders href on scroll-spy links", () => {
    const { container } = render(
      <ScrollSpy items={[{ href: "#section-1", title: "Section 1" }]} />,
    );
    const link = container.querySelector(
      'a[data-slot="scroll-spy-link"]',
    ) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("#section-1");
  });

  it("renders title text on scroll-spy links", () => {
    const { container } = render(
      <ScrollSpy items={[{ href: "#sec", title: "My Section" }]} />,
    );
    expect(container.textContent).toContain("My Section");
  });

  it("renders title when title prop is provided", () => {
    const { container } = render(
      <ScrollSpy
        title="On this page"
        items={[{ href: "#sec", title: "My Section" }]}
      />,
    );
    const title = container.querySelector('[data-slot="scroll-spy-title"]');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe("On this page");
  });

  it("renders children when no items provided", () => {
    const { container } = render(<ScrollSpy>Custom content</ScrollSpy>);
    expect(container.textContent).toContain("Custom content");
  });

  it("renders angle circuit variant with SVG track", () => {
    const { container } = render(
      <ScrollSpy
        variant="angle"
        items={[
          {
            href: "#sec-1",
            title: "Sec 1",
            children: [{ href: "#sec-1-1", title: "Sec 1.1" }],
          },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    const nav = container.querySelector(
      'nav[data-slot="scroll-spy"]',
    ) as HTMLElement;
    expect(nav.getAttribute("data-variant")).toBe("angle");
    expect(nav.getAttribute("data-turn")).toBe("rounded");
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders rounded turn variant and fill indicator", () => {
    const { container } = render(
      <ScrollSpy
        turn="rounded"
        indicator="fill"
        items={[
          { href: "#sec-1", title: "Sec 1" },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    const nav = container.querySelector(
      'nav[data-slot="scroll-spy"]',
    ) as HTMLElement;
    expect(nav.getAttribute("data-variant")).toBe("rounded");
    expect(nav.getAttribute("data-turn")).toBe("rounded");
    expect(nav.getAttribute("data-indicator")).toBe("fill");
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("supports progress indicator mode for reading scroll progress", () => {
    const { container } = render(
      <ScrollSpy
        indicator="progress"
        items={[
          { href: "#sec-1", title: "Sec 1" },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    const nav = container.querySelector(
      'nav[data-slot="scroll-spy"]',
    ) as HTMLElement;
    expect(nav.getAttribute("data-indicator")).toBe("progress");
  });

  it("supports left side position with right-side rail", () => {
    const { container } = render(
      <ScrollSpy
        position="left"
        railPosition="right"
        items={[
          { href: "#sec-1", title: "Sec 1" },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    const nav = container.querySelector(
      'nav[data-slot="scroll-spy"]',
    ) as HTMLElement;
    expect(nav.getAttribute("data-position")).toBe("left");
    expect(nav.getAttribute("data-rail-position")).toBe("right");
    const list = container.querySelector(
      'ul[data-slot="scroll-spy-list"]',
    ) as HTMLElement;
    expect(list.className).toContain("border-r");
  });

  it("renders top sticky stepper mode", () => {
    const { container } = render(
      <ScrollSpy
        position="top"
        items={[
          { href: "#step-1", title: "Step 1" },
          { href: "#step-2", title: "Step 2" },
        ]}
      />,
    );
    expect(
      container.querySelector('[data-slot="scroll-spy-stepper-top"]'),
    ).toBeTruthy();
  });

  it("renders top sticky scroll spy mode highlighting only active section", () => {
    const { container } = render(
      <ScrollSpy
        position="top"
        variant="scrollspy"
        items={[
          { href: "#sec-1", title: "Sec 1" },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    expect(
      container.querySelector('[data-slot="scroll-spy-top"]'),
    ).toBeTruthy();
    const buttons = container.querySelectorAll(
      '[data-slot="scroll-spy-top"] button',
    );
    expect(buttons.length).toBe(2);
    expect(buttons[0].getAttribute("data-active")).toBe("true");
    expect(buttons[1].getAttribute("data-active")).toBe("false");
  });

  it("renders bottom floating stepper mode", () => {
    const { container } = render(
      <ScrollSpy
        position="bottom"
        items={[
          { href: "#step-1", title: "Step 1" },
          { href: "#step-2", title: "Step 2" },
        ]}
      />,
    );
    expect(
      container.querySelector('[data-slot="scroll-spy-stepper-bottom"]'),
    ).toBeTruthy();
  });

  it("supports compound component composition", () => {
    const { container } = render(
      <ScrollSpy>
        <ScrollSpyTitle>On this page</ScrollSpyTitle>
        <ScrollSpyList>
          <ScrollSpyIndicator />
          <ScrollSpyItem value="#first">
            <ScrollSpyLink href="#first">First Item</ScrollSpyLink>
          </ScrollSpyItem>
          <ScrollSpyItem value="#second">
            <ScrollSpyLink href="#second">Second Item</ScrollSpyLink>
          </ScrollSpyItem>
        </ScrollSpyList>
      </ScrollSpy>,
    );
    expect(
      container.querySelector('[data-slot="scroll-spy-title"]')?.textContent,
    ).toBe("On this page");
    expect(
      container.querySelectorAll('[data-slot="scroll-spy-link"]').length,
    ).toBe(2);
  });

  it("supports keepScrolled prop and sets data-keep-scrolled", () => {
    const { container } = render(
      <ScrollSpy
        keepScrolled
        items={[
          { href: "#sec-1", title: "Sec 1" },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    expect(
      container
        .querySelector('[data-slot="scroll-spy"]')
        ?.getAttribute("data-keep-scrolled"),
    ).toBe("true");
  });

  it("supports highlightParent and marks parent link with data-parent-active", () => {
    const { container } = render(
      <ScrollSpy
        value="#sub-1"
        highlightParent
        items={[
          {
            href: "#parent-1",
            title: "Parent 1",
            children: [{ href: "#sub-1", title: "Sub 1" }],
          },
          { href: "#parent-2", title: "Parent 2" },
        ]}
      />,
    );
    const links = Array.from(
      container.querySelectorAll('[data-slot="scroll-spy-link"]'),
    );
    const parentLink = links.find(
      (l) => l.getAttribute("href") === "#parent-1",
    );
    const subLink = links.find((l) => l.getAttribute("href") === "#sub-1");

    expect(subLink?.getAttribute("data-active")).toBe("true");
    expect(parentLink?.getAttribute("data-parent-active")).toBe("true");
  });

  it("supports lineWidth prop and sets data-line-width", () => {
    const { container } = render(
      <ScrollSpy
        lineWidth={3}
        items={[
          { href: "#sec-1", title: "Sec 1" },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    expect(
      container
        .querySelector('[data-slot="scroll-spy"]')
        ?.getAttribute("data-line-width"),
    ).toBe("3");
  });

  it("supports color prop, sets data-color, applies color only to handle and keeps link text neutral", () => {
    const { container } = render(
      <ScrollSpy
        color="destructive"
        items={[
          { href: "#sec-1", title: "Sec 1" },
          { href: "#sec-2", title: "Sec 2" },
        ]}
      />,
    );
    const nav = container.querySelector('[data-slot="scroll-spy"]');
    expect(nav?.getAttribute("data-color")).toBe("destructive");

    const activeLink = container.querySelector(
      '[data-slot="scroll-spy-link"][data-active="true"]',
    );
    expect(activeLink).not.toBeNull();
    const classList = activeLink?.className || "";
    // Link text MUST be neutral foreground, NOT colored
    expect(classList).toContain("text-foreground");
    expect(classList).toContain("font-medium");
    expect(classList).not.toContain("text-destructive");
    expect(classList).not.toContain("text-primary");
  });
});
