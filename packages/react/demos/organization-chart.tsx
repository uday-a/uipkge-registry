import { useState } from "react";
import Story from "../../components/story/Story";
import {
  OrganizationChart,
  type OrgNode,
} from "@react-registry/organization-chart";
import { Badge } from "@react-registry/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@react-registry/card";

const acmeOrg: OrgNode = {
  id: "1",
  name: "Sarah Johnson",
  title: "Chief Executive Officer",
  avatar: "https://i.pravatar.cc/80?img=47",
  department: "Executive",
  children: [
    {
      id: "2",
      name: "Michael Chen",
      title: "VP of Engineering",
      avatar: "https://i.pravatar.cc/80?img=12",
      department: "Engineering",
      children: [
        {
          id: "5",
          name: "Alex Rivera",
          title: "Engineering Lead",
          avatar: "https://i.pravatar.cc/80?img=33",
          department: "Engineering",
          children: [
            {
              id: "8",
              name: "Jordan Lee",
              title: "Senior Engineer",
              department: "Engineering",
            },
            {
              id: "9",
              name: "Taylor Brooks",
              title: "Frontend Engineer",
              department: "Engineering",
            },
          ],
        },
        {
          id: "6",
          name: "Sam Patel",
          title: "DevOps Lead",
          department: "Engineering",
        },
      ],
    },
    {
      id: "3",
      name: "Emily Davis",
      title: "VP of Sales",
      avatar: "https://i.pravatar.cc/80?img=45",
      department: "Sales",
      children: [
        {
          id: "7",
          name: "Chris Brown",
          title: "Sales Manager",
          department: "Sales",
        },
        {
          id: "10",
          name: "Maria Garcia",
          title: "Account Executive",
          department: "Sales",
        },
      ],
    },
    {
      id: "4",
      name: "David Wilson",
      title: "VP of Marketing",
      avatar: "https://i.pravatar.cc/80?img=60",
      department: "Marketing",
    },
  ],
};

export default function OrganizationChartDemo() {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [lastToggle, setLastToggle] = useState("");

  return (
    <>
      <Story
        title="Acme Inc. leadership"
        description="A real company reporting structure — CEO at the top, three VPs, and their direct reports with avatars and titles."
      >
        <OrganizationChart
          data={acmeOrg}
          onNodeClick={(node) => setSelectedNode(node)}
          className="w-full"
        />
        {selectedNode && (
          <p className="text-muted-foreground mt-3 text-xs">
            Selected:{" "}
            <span className="text-foreground font-medium">
              {selectedNode.name}
            </span>{" "}
            · {selectedNode.title}
          </p>
        )}
      </Story>

      <Story
        title="With department badges"
        description="Use the renderNode prop to render a department badge inside each card — useful for filtering by team."
      >
        <OrganizationChart
          data={acmeOrg}
          className="w-full"
          renderNode={(node) =>
            node.department ? (
              <div className="mt-1">
                <Badge variant="secondary" className="text-xs">
                  {node.department as string}
                </Badge>
              </div>
            ) : null
          }
        />
      </Story>

      <Story
        title="Horizontal layout"
        description="direction='left-right' flows the tree sideways — better for wide orgs with many direct reports per level."
      >
        <OrganizationChart
          data={acmeOrg}
          direction="left-right"
          className="w-full"
        />
      </Story>

      <Story
        title="Zoomable explorer"
        description="Add zoom controls plus expand/collapse-all for large orgs where users need to navigate and resize."
      >
        <OrganizationChart data={acmeOrg} zoomable className="w-full" />
      </Story>

      <Story
        title="Collapsed by default"
        description="Start with only the root visible — users drill into the branches they care about."
      >
        <OrganizationChart
          data={acmeOrg}
          defaultExpanded={false}
          className="w-full"
        />
      </Story>

      <Story
        title="In a reporting card"
        description="The chart embedded in a Card with a header — how it looks in a People or HR dashboard section."
      >
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle className="text-base">Reporting structure</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationChart
              data={acmeOrg}
              defaultExpanded={false}
              onToggle={(node, expanded) =>
                setLastToggle(
                  `${node.name}: ${expanded ? "expanded" : "collapsed"}`,
                )
              }
              className="w-full"
            />
            {lastToggle && (
              <p className="text-muted-foreground mt-2 text-xs">{lastToggle}</p>
            )}
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Initials fallback"
        description="Nodes without an avatar show colored initials — the default for ICs who haven't uploaded a photo."
      >
        <OrganizationChart
          data={{
            id: "r",
            name: "Robin Hayes",
            title: "Director",
            children: [
              { id: "a", name: "Alice Carter", title: "Team Lead" },
              { id: "b", name: "Ben Walsh", title: "Team Lead" },
            ],
          }}
          className="w-full"
        />
      </Story>
    </>
  );
}
