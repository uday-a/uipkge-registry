import { useEffect, useState } from "react";
import Story from "../../components/story/Story";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { Progress } from "@react-registry/progress";

export default function ProgressDemo() {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAnimated((v) => (v >= 100 ? 0 : v + 5));
    }, 600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <Story
        title="With label"
        description="Progress bar paired with label and percentage row above the track."
      >
        <div className="max-w-md space-y-3">
          <div>
            <div className="text-muted-foreground mb-1.5 flex justify-between text-xs">
              <span>Loading…</span>
              <span>33%</span>
            </div>
            <Progress value={33} />
          </div>
          <div>
            <div className="text-muted-foreground mb-1.5 flex justify-between text-xs">
              <span>Almost done</span>
              <span>83%</span>
            </div>
            <Progress value={83} />
          </div>
        </div>
      </Story>

      <Story
        title="Discrete states"
        description="Empty, half, and complete tracks side by side."
      >
        <div className="max-w-md space-y-4">
          <div>
            <div className="text-muted-foreground mb-1.5 text-xs">0%</div>
            <Progress value={0} />
          </div>
          <div>
            <div className="text-muted-foreground mb-1.5 text-xs">50%</div>
            <Progress value={50} />
          </div>
          <div>
            <div className="text-muted-foreground mb-1.5 text-xs">100%</div>
            <Progress value={100} />
          </div>
        </div>
      </Story>

      <Story
        title="Multi-percentage row"
        description="Static showcase across a typical 0–100 range."
      >
        <div className="grid max-w-md gap-3">
          <Progress value={10} />
          <Progress value={30} />
          <Progress value={55} />
          <Progress value={78} />
          <Progress value={95} />
        </div>
      </Story>

      <Story
        title="Animated value"
        description="Reactive modelValue auto-cycles every 600ms; the indicator transitions smoothly."
      >
        <div className="max-w-md space-y-3">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Uploading file…</span>
            <span className="tabular-nums">{animated}%</span>
          </div>
          <Progress value={animated} />
        </div>
      </Story>

      <Story
        title="In a card"
        description="Common use inside a card: title, description, and a labeled progress row."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>You're using 6.4 GB of 10 GB.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={64} />
            <p className="text-muted-foreground mt-2 text-xs">
              3.6 GB remaining on your current plan.
            </p>
          </CardContent>
        </Card>
      </Story>
    </>
  );
}
