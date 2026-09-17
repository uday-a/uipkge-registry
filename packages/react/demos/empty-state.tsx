import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import { EmptyState } from "@react-registry/empty-state";
import { Inbox, Plus, Search, ServerCrash, FileX2, Upload } from "lucide-react";

export default function EmptyStateDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Centered icon, title, description, and a single primary action."
      >
        <EmptyState
          title="No messages"
          description="When you receive new messages, they'll appear here."
          icon={Inbox}
        >
          <Button className="mt-4">
            <Plus />
            New message
          </Button>
        </EmptyState>
      </Story>

      <Story
        title="Without action"
        description="Icon, title, and description only — no slot content."
      >
        <EmptyState
          title="Nothing scheduled"
          description="You have no upcoming events on your calendar."
          icon={Inbox}
        />
      </Story>

      <Story
        title="With multiple actions"
        description="Primary plus secondary action stacked horizontally below the description."
      >
        <EmptyState
          title="Project is empty"
          description="Get started by creating a new file or importing existing data."
          icon={FileX2}
        >
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button>
              <Plus />
              New file
            </Button>
            <Button variant="outline">
              <Upload />
              Import
            </Button>
          </div>
        </EmptyState>
      </Story>

      <Story
        title="Different scenarios"
        description="Same component reused for no-data, error, and filtered-out states — only icon and copy change."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <EmptyState
            className="rounded-lg border border-dashed py-8"
            title="No data yet"
            description="Records will show up here once created."
            icon={Inbox}
          />
          <EmptyState
            className="rounded-lg border border-dashed py-8"
            title="Something went wrong"
            description="We couldn't load this resource. Try again."
            icon={ServerCrash}
          >
            <Button variant="outline" size="sm" className="mt-4">
              Retry
            </Button>
          </EmptyState>
          <EmptyState
            className="rounded-lg border border-dashed py-8"
            title="No matches"
            description="No results match your current filters."
            icon={Search}
          >
            <Button variant="ghost" size="sm" className="mt-4">
              Clear filters
            </Button>
          </EmptyState>
        </div>
      </Story>
    </>
  );
}
