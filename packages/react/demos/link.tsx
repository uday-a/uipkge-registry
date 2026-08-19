import Story from "../../components/story/Story";
import { Link } from "@react-registry/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Home,
  LifeBuoy,
} from "lucide-react";

export default function LinkDemo() {
  return (
    <>
      <Story
        title="Inline in body copy"
        description="Links flow naturally inside a paragraph — the most common place you'll reach for this component."
      >
        <p className="text-foreground max-w-md text-sm leading-relaxed">
          By signing up you agree to our{" "}
          <Link href="#" underline="always">
            Terms of Service
          </Link>{" "}
          and acknowledge our
          <Link href="#" underline="always">
            Privacy Policy
          </Link>
          . Need help? Visit our
          <Link href="#" left={<FileText />}>
            support center
          </Link>
          .
        </p>
      </Story>

      <Story
        title="Color & underline"
        description="Three color tones paired with the three underline modes, so you can pick the right emphasis for the surrounding text."
      >
        <div className="max-w-md space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="#" color="default">
              Default
            </Link>
            <Link href="#" color="primary">
              Primary
            </Link>
            <Link href="#" color="muted">
              Muted
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="#" underline="always">
              Always
            </Link>
            <Link href="#" underline="hover">
              Hover
            </Link>
            <Link href="#" underline="none">
              None
            </Link>
          </div>
        </div>
      </Story>

      <Story
        title="Sizes"
        description="sm, default, and lg for matching the surrounding text scale."
      >
        <div className="flex max-w-md flex-wrap items-baseline gap-4">
          <Link href="#" size="sm">
            Small link
          </Link>
          <Link href="#" size="default">
            Default link
          </Link>
          <Link href="#" size="lg">
            Large link
          </Link>
        </div>
      </Story>

      <Story
        title="With icons"
        description="Left and right slots for leading and trailing icons — trailing is common for external links and 'continue' affordances."
      >
        <div className="flex max-w-md flex-wrap items-center gap-4 text-sm">
          <Link href="#" left={<Home />}>
            Home
          </Link>
          <Link href="#" left={<FileText />}>
            Article
          </Link>
          <Link href="https://uipkge.dev" right={<ExternalLink />}>
            Visit site
          </Link>
          <Link href="#" right={<ArrowRight />}>
            Continue
          </Link>
        </div>
      </Story>

      <Story
        title="External vs internal"
        description="http(s) hrefs auto-open in a new tab with rel=noopener. Pass external={false} to force same-tab, or use a relative href."
      >
        <p className="text-sm">
          External: <Link href="https://uipkge.dev">uipkge.dev</Link> opens in a
          new tab. Internal:
          <Link href="/about" external={false}>
            About page
          </Link>{" "}
          stays in-tab.
        </p>
      </Story>

      <Story
        title="Disabled"
        description="Non-interactive links are dimmed and ignore pointer events."
      >
        <div className="flex max-w-md flex-wrap items-center gap-4 text-sm">
          <Link href="#" disabled>
            Disabled link
          </Link>
          <Link href="#" color="muted" disabled>
            Disabled muted
          </Link>
        </div>
      </Story>

      <Story
        title="In a card footer"
        description="A realistic placement — a help card that links to docs, support, and an external status page."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Need a hand?</CardTitle>
            <CardDescription>
              We're here Monday through Friday, 9–5 GMT.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="#" left={<LifeBuoy />}>
              Support center
            </Link>
            <Link href="#">Documentation</Link>
            <Link href="https://status.uipkge.dev" right={<ExternalLink />}>
              Status
            </Link>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="AsChild"
        description="Compose full link styling onto a custom element — a button, router-link, or anchor."
      >
        <Link asChild href="#">
          <button className="px-2 py-1">Button styled as link</button>
        </Link>
      </Story>
    </>
  );
}
