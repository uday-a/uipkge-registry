import Story from "../../components/story/Story";
import { useState } from "react";
import { ThemeSwitch } from "@react-registry/theme-switch";

export default function ThemeSwitchDemo() {
  const [cards, setCards] = useState<"light" | "dark" | "system">("system");
  const [icons, setIcons] = useState<"light" | "dark" | "system">("system");
  const [iconOnly, setIconOnly] = useState<"light" | "dark">("light");
  const [dropdown, setDropdown] = useState<"light" | "dark" | "system">(
    "system",
  );
  const [pill, setPill] = useState<"light" | "dark" | "system">("system");
  const [pill4, setPill4] = useState<"light" | "dark" | "system" | "black">(
    "system",
  );
  const [sw, setSw] = useState<"light" | "dark">("light");

  return (
    <>
      <Story
        title="Cards"
        description="Default — full SectionCard with three labeled buttons. Best for settings pages."
      >
        <ThemeSwitch
          value={cards}
          onValueChange={(v) => setCards(v as typeof cards)}
          variant="cards"
          className="max-w-md"
        />
      </Story>

      <Story
        title="Icons"
        description="Compact 3-icon segmented row, no labels. Fits in toolbars."
      >
        <ThemeSwitch
          value={icons}
          onValueChange={(v) => setIcons(v as typeof icons)}
          variant="icons"
        />
      </Story>

      <Story
        title="Icon only"
        description="Single icon button cycling Light ⇆ Dark — header-grade, no chrome."
      >
        <ThemeSwitch
          value={iconOnly}
          onValueChange={(v) => setIconOnly(v as typeof iconOnly)}
          variant="icon-only"
        />
      </Story>

      <Story
        title="Dropdown"
        description="Trigger button opening a DropdownMenu with the state list. Header-friendly."
      >
        <ThemeSwitch
          value={dropdown}
          onValueChange={(v) => setDropdown(v as typeof dropdown)}
          variant="dropdown"
        />
      </Story>

      <Story
        title="Pill"
        description="Equal-width segments under a sliding primary indicator. Smooth 300ms translate."
      >
        <ThemeSwitch
          value={pill}
          onValueChange={(v) => setPill(v as typeof pill)}
          variant="pill"
          className="max-w-sm"
        />
      </Story>

      <Story
        title="Pill — 4 states"
        description="Same sliding indicator, four states (system / light / dark / black-OLED)."
      >
        <ThemeSwitch
          value={pill4}
          onValueChange={(v) => setPill4(v as typeof pill4)}
          variant="pill-4"
          className="max-w-md"
        />
      </Story>

      <Story
        title="Switch"
        description="iOS-style toggle with sun/moon glyphs at the ends. The thumb slides; idle glyph dims."
      >
        <ThemeSwitch
          value={sw}
          onValueChange={(v) => setSw(v as typeof sw)}
          variant="switch"
        />
      </Story>
    </>
  );
}
