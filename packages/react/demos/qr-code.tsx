import Story from "../../components/story/Story";
import { useState } from "react";
import { Button } from "@react-registry/button";
import {
  QrCode,
  type QRCodeStatus,
  type QRCodeErrorLevel,
} from "@react-registry/qr-code";

const basicValue = "https://uipkge.dev";
const customValue = "https://github.com/uday-a/next-boilerplate";
const iconValue = "https://uipkge.dev";
const longValue =
  "https://uipkge.dev/components/qr-code?demo=true&source=github&ref=main";

const statuses: QRCodeStatus[] = ["active", "expired", "loading", "scanned"];

const colors = [
  { color: "#000000", bgColor: "#ffffff", label: "Default" },
  { color: "#1677ff", bgColor: "#ffffff", label: "Blue" },
  { color: "#52c41a", bgColor: "#ffffff", label: "Green" },
  { color: "#fa8c16", bgColor: "#ffffff", label: "Orange" },
  { color: "#eb2f96", bgColor: "#ffffff", label: "Pink" },
  { color: "#722ed1", bgColor: "#ffffff", label: "Purple" },
];

const errorLevels: QRCodeErrorLevel[] = ["L", "M", "Q", "H"];

export default function QrCodeDemo() {
  const [currentStatus, setCurrentStatus] = useState<QRCodeStatus>("active");
  const [customContentValue, setCustomContentValue] = useState(basicValue);

  function onRefresh() {
    alert("Refresh triggered!");
  }

  return (
    <>
      <Story title="Basic" description="Default QR code with URL value.">
        <QrCode value={basicValue} />
      </Story>

      <Story title="Sizes" description="Different sizes from small to large.">
        <div className="flex flex-wrap items-end gap-4">
          <QrCode value={basicValue} size={80} />
          <QrCode value={basicValue} size={120} />
          <QrCode value={basicValue} size={160} />
          <QrCode value={basicValue} size={200} />
        </div>
      </Story>

      <Story
        title="Custom Colors"
        description="Foreground and background color combinations."
      >
        <div className="flex flex-wrap gap-4">
          {colors.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-1">
              <QrCode
                value={basicValue}
                color={c.color}
                bgColor={c.bgColor}
                size={100}
              />
              <span className="text-muted-foreground text-xs">{c.label}</span>
            </div>
          ))}
        </div>
      </Story>

      <Story title="SVG Type" description="Render as SVG instead of canvas.">
        <div className="flex gap-4">
          <QrCode value={basicValue} type="canvas" />
          <QrCode value={basicValue} type="svg" />
        </div>
      </Story>

      <Story
        title="With Icon"
        description="Embed a logo or icon in the center."
      >
        <QrCode
          value={iconValue}
          icon="https://github.com/uday-a.png"
          iconSize={40}
          errorLevel="H"
        />
      </Story>

      <Story
        title="Error Levels"
        description="Different error correction levels (L/M/Q/H). Higher = more robust."
      >
        <div className="flex flex-wrap gap-4">
          {errorLevels.map((level) => (
            <div key={level} className="flex flex-col items-center gap-1">
              <QrCode value={longValue} errorLevel={level} size={120} />
              <span className="text-muted-foreground text-xs">
                Level {level}
              </span>
            </div>
          ))}
        </div>
      </Story>

      <Story
        title="Borderless"
        description="Without the default border and padding."
      >
        <QrCode value={basicValue} bordered={false} />
      </Story>

      <Story
        title="Margin / Quiet Zone"
        description="Add quiet zone around the QR code."
      >
        <div className="flex gap-4">
          <QrCode value={basicValue} marginSize={0} size={120} />
          <QrCode value={basicValue} marginSize={2} size={120} />
          <QrCode value={basicValue} marginSize={4} size={120} />
        </div>
      </Story>

      <Story
        title="Status"
        description="Active, expired, loading, and scanned states."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={currentStatus === s ? "default" : "outline"}
                onClick={() => setCurrentStatus(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <QrCode
            value={customValue}
            status={currentStatus}
            onRefresh={onRefresh}
          />
        </div>
      </Story>

      <Story
        title="Long URL"
        description="Dense QR code from a long URL. Use larger size or higher error level."
      >
        <div className="flex flex-col items-start gap-2">
          <QrCode value={longValue} size={200} errorLevel="H" />
          <p className="text-muted-foreground max-w-md truncate text-xs">
            {longValue}
          </p>
        </div>
      </Story>

      <Story
        title="Download"
        description="Click the download link to save the QR code as PNG."
      >
        <QrCode value={basicValue} />
      </Story>

      <Story
        title="Custom Content"
        description="Use the #extra slot for custom actions."
      >
        <QrCode
          value={customContentValue}
          extra={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCustomContentValue(
                    "https://uipkge.dev/components/advance-select",
                  )
                }
              >
                Change URL
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCustomContentValue("https://uipkge.dev")}
              >
                Reset
              </Button>
            </div>
          }
        />
      </Story>
    </>
  );
}
