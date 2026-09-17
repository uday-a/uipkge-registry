import * as React from "react";
import Story from "../../components/story/Story";
import { BubbleMap, type MapBubble } from "@/components/ui/charts/bubble-map";

const CLOUD_BUBBLES: MapBubble[] = [
  {
    id: "us-west-sfo",
    name: "San Francisco (us-west-1)",
    lat: 37.77,
    lng: -122.41,
    value: 84200,
    formattedValue: "84,200 nodes",
    category: "Edge Hub",
    status: "optimal",
    pulse: true,
    description:
      "Primary Pacific edge cluster with 99.999% uptime and 100Gbps cross-connects.",
  },
  {
    id: "us-east-iad",
    name: "Northern Virginia (us-east-1)",
    lat: 38.9,
    lng: -77.03,
    value: 148500,
    formattedValue: "148,500 nodes",
    category: "Core Data Center",
    status: "optimal",
    pulse: true,
    description:
      "Largest tier-4 hyper-scaler datacenter campus with dense redundant backbones.",
  },
  {
    id: "eu-west-lhr",
    name: "London (eu-west-2)",
    lat: 51.5,
    lng: -0.12,
    value: 92400,
    formattedValue: "92,400 nodes",
    category: "Edge Hub",
    status: "optimal",
    pulse: false,
    description:
      "European peering exchange gateway serving UK and Nordic corridors.",
  },
  {
    id: "eu-central-fra",
    name: "Frankfurt (eu-central-1)",
    lat: 50.11,
    lng: 8.68,
    value: 112000,
    formattedValue: "112,000 nodes",
    category: "Core Data Center",
    status: "optimal",
    pulse: true,
    description:
      "DE-CIX peering node with direct sub-millisecond continental transit.",
  },
  {
    id: "ap-northeast-hnd",
    name: "Tokyo (ap-northeast-1)",
    lat: 35.67,
    lng: 139.65,
    value: 78900,
    formattedValue: "78,900 nodes",
    category: "Core Data Center",
    status: "optimal",
    pulse: false,
    description:
      "Asia-Pacific backbone terminal with trans-Pacific undersea cable landing.",
  },
  {
    id: "ap-southeast-sin",
    name: "Singapore (ap-southeast-1)",
    lat: 1.35,
    lng: 103.81,
    value: 65400,
    formattedValue: "65,400 nodes",
    category: "Edge Hub",
    status: "optimal",
    pulse: true,
    description:
      "Equinix SG3 multi-cloud transit exchange interconnecting Southeast Asia.",
  },
  {
    id: "sa-east-gru",
    name: "São Paulo (sa-east-1)",
    lat: -23.55,
    lng: -46.63,
    value: 32100,
    formattedValue: "32,100 nodes",
    category: "Edge Hub",
    status: "optimal",
    pulse: false,
    description:
      "South America primary edge nexus with subsea Monet connectivity.",
  },
  {
    id: "ap-southeast-syd",
    name: "Sydney (ap-southeast-2)",
    lat: -33.86,
    lng: 151.2,
    value: 41800,
    formattedValue: "41,800 nodes",
    category: "Edge Hub",
    status: "optimal",
    pulse: false,
    description:
      "Australia and Oceania gateway linked to trans-Tasman fiber cables.",
  },
];

const THREAT_BUBBLES: MapBubble[] = [
  {
    id: "th-1",
    name: "Kyiv / Eastern Europe",
    lat: 50.45,
    lng: 30.52,
    value: 9400,
    formattedValue: "9,400 Layer-7 Flood req/s",
    category: "Volumetric Flood",
    status: "destructive",
    pulse: true,
    description:
      "High-intensity distributed syn-flood mitigated by Anycast scrubbing centers.",
  },
  {
    id: "th-2",
    name: "Taipei Metro Core",
    lat: 25.03,
    lng: 121.56,
    value: 6200,
    formattedValue: "6,200 DNS Amp req/s",
    category: "DNS Amplification",
    status: "warning",
    pulse: true,
    description:
      "Reflective DNS queries targeting authoritative DNS nameservers.",
  },
  {
    id: "th-3",
    name: "São Paulo Datacenter",
    lat: -23.55,
    lng: -46.63,
    value: 3800,
    formattedValue: "3,800 Credential Stuff req/s",
    category: "Credential Stuffing",
    status: "warning",
    pulse: false,
    description:
      "Automated headless browser botnet executing token replay sequences.",
  },
  {
    id: "th-4",
    name: "Amsterdam IX",
    lat: 52.36,
    lng: 4.9,
    value: 12500,
    formattedValue: "12,500 NTP Reflection req/s",
    category: "NTP Reflection",
    status: "destructive",
    pulse: true,
    description:
      "Massive volumetric amplification attack blocked at border gateway routers.",
  },
  {
    id: "th-5",
    name: "New York Financial Gateway",
    lat: 40.71,
    lng: -74.0,
    value: 2100,
    formattedValue: "2,100 WAF Rule Triggers/s",
    category: "SQLi Probe",
    status: "active",
    pulse: false,
    description:
      "Automated vulnerability scanner probes captured and blocked by adaptive WAF.",
  },
];

export default function BubbleMapDemo() {
  const [selectedNode, setSelectedNode] = React.useState<string | undefined>(
    "us-east-iad",
  );
  const [selectedThreat, setSelectedThreat] = React.useState<
    string | undefined
  >(undefined);

  return (
    <>
      <Story
        title="Global Compute Clusters"
        description="Proportional symbol bubble map displaying active container nodes across worldwide infrastructure regions. Circle radius mathematically scales with volume, avoiding geographic landmass bias."
      >
        <div className="flex flex-col gap-4">
          <BubbleMap
            selectedId={selectedNode}
            onSelectedIdChange={setSelectedNode}
            bubbles={CLOUD_BUBBLES}
            legendTitle="Active Containers"
            minRadius={6}
            maxRadius={26}
          />
          {selectedNode && (
            <div className="border-border bg-card/60 text-muted-foreground flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs">
              <span className="text-foreground font-medium">
                Selected Cluster:{" "}
                <span className="text-primary font-mono">{selectedNode}</span>
              </span>
              <span>
                Click any circle or press{" "}
                <kbd className="border-border rounded border px-1 py-0.5 font-mono">
                  Enter
                </kbd>{" "}
                to inspect
              </span>
            </div>
          )}
        </div>
      </Story>

      <Story
        title="Cyber Incident Threat Radar"
        description="Critical security events visualizer with pulsing radar rings and severity status color tokens (Destructive, Warning, Active)."
      >
        <BubbleMap
          selectedId={selectedThreat}
          onSelectedIdChange={setSelectedThreat}
          bubbles={THREAT_BUBBLES}
          legendTitle="Incident Ingress / sec"
          minRadius={7}
          maxRadius={24}
        />
      </Story>
    </>
  );
}
