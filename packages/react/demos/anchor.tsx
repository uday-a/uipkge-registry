import Story from "../../components/story/Story";
import { Anchor, AnchorLink, type AnchorItem } from "@react-registry/anchor";

const items: AnchorItem[] = [
  { href: "#section-1", title: "Introduction" },
  {
    href: "#section-2",
    title: "Architecture",
    children: [
      { href: "#section-2-1", title: "Modules" },
      { href: "#section-2-2", title: "Boundaries" },
    ],
  },
  { href: "#section-3", title: "API" },
  { href: "#section-4", title: "Examples" },
];

export default function AnchorDemo() {
  return (
    <>
      <Story
        title="Declarative items"
        description="Pass a flat or nested array. Active link highlights as you scroll the page."
      >
        <div className="grid grid-cols-[160px_1fr] gap-6">
          <Anchor items={items} offsetTop={80} affix />
          <div className="space-y-12">
            <section id="section-1" className="min-h-[60vh]">
              <h2 className="text-lg font-semibold">Introduction</h2>
              <p className="text-muted-foreground text-sm">
                Lorem ipsum dolor sit amet.
              </p>
            </section>
            <section id="section-2" className="min-h-[40vh]">
              <h2 className="text-lg font-semibold">Architecture</h2>
              <div id="section-2-1" className="min-h-[30vh]">
                <h3 className="font-medium">Modules</h3>
                <p className="text-muted-foreground text-sm">
                  Sub-section content.
                </p>
              </div>
              <div id="section-2-2" className="min-h-[30vh]">
                <h3 className="font-medium">Boundaries</h3>
                <p className="text-muted-foreground text-sm">
                  Sub-section content.
                </p>
              </div>
            </section>
            <section id="section-3" className="min-h-[60vh]">
              <h2 className="text-lg font-semibold">API</h2>
            </section>
            <section id="section-4" className="min-h-[60vh]">
              <h2 className="text-lg font-semibold">Examples</h2>
            </section>
          </div>
        </div>
      </Story>

      <Story
        title="Composed with AnchorLink"
        description="Use child components for full control over each link."
      >
        <div className="grid grid-cols-[160px_1fr] gap-6">
          <Anchor offsetTop={80} affix>
            <AnchorLink href="#a-1" title="Apples" />
            <AnchorLink href="#a-2" title="Bananas">
              <AnchorLink href="#a-2-1" title="Cavendish" />
              <AnchorLink href="#a-2-2" title="Plantain" />
            </AnchorLink>
            <AnchorLink href="#a-3" title="Cherries" />
          </Anchor>
          <div className="space-y-12">
            <section id="a-1" className="min-h-[40vh]">
              <h2 className="font-semibold">Apples</h2>
            </section>
            <section id="a-2" className="min-h-[20vh]">
              <h2 className="font-semibold">Bananas</h2>
            </section>
            <section id="a-2-1" className="min-h-[30vh]">
              <h3>Cavendish</h3>
            </section>
            <section id="a-2-2" className="min-h-[30vh]">
              <h3>Plantain</h3>
            </section>
            <section id="a-3" className="min-h-[40vh]">
              <h2 className="font-semibold">Cherries</h2>
            </section>
          </div>
        </div>
      </Story>
    </>
  );
}
