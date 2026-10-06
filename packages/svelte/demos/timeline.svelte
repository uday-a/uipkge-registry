<script lang="ts">
  import {
    Timeline,
    TimelineContent,
    TimelineDate,
    TimelineDescription,
    TimelineHeader,
    TimelineItem,
    TimelineMedia,
    TimelineTitle,
  } from '@svelte-registry/timeline'
  import { Check, GitCommitHorizontal, Rocket } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <Timeline>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Order placed</TimelineTitle>
          <TimelineDate>09:41</TimelineDate>
        </TimelineHeader>
        <TimelineDescription>Order #4821 confirmed and sent to the warehouse.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Shipped</TimelineTitle>
          <TimelineDate>11:02</TimelineDate>
        </TimelineHeader>
        <TimelineDescription>Left the Memphis facility via ground freight.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Out for delivery</TimelineTitle>
          <TimelineDate>Today</TimelineDate>
        </TimelineHeader>
        <TimelineDescription>Arriving by 8 PM.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
{/if}

{#if story === 'Icon markers'}
  <Timeline>
    <TimelineItem status="success">
      <TimelineMedia variant="icon" status="success"><Check /></TimelineMedia>
      <TimelineContent>
        <TimelineTitle>Tests passed</TimelineTitle>
        <TimelineDescription>1,284 assertions green on main.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="current">
      <TimelineMedia variant="icon" status="current"><GitCommitHorizontal /></TimelineMedia>
      <TimelineContent>
        <TimelineTitle>Deploying</TimelineTitle>
        <TimelineDescription>Rolling out to 40% of traffic.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="muted">
      <TimelineMedia variant="icon" status="muted"><Rocket /></TimelineMedia>
      <TimelineContent>
        <TimelineTitle>Release notes</TimelineTitle>
        <TimelineDescription>Pending rollout completion.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
{/if}

{#if story === 'Status colors'}
  <Timeline>
    <TimelineItem status="success">
      <TimelineMedia status="success" coloredConnector />
      <TimelineContent>
        <TimelineTitle>Payment captured</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="warning">
      <TimelineMedia status="warning" coloredConnector />
      <TimelineContent>
        <TimelineTitle>Address needs review</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="error">
      <TimelineMedia status="error" />
      <TimelineContent>
        <TimelineTitle>Carrier pickup failed</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
{/if}

{#if story === 'Alternating sides'}
  <Timeline align="center">
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>Founded</TimelineTitle>
        <TimelineDescription>Two engineers and a whiteboard.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>Series A</TimelineTitle>
        <TimelineDescription>Raised to build the platform team.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>1M users</TimelineTitle>
        <TimelineDescription>Celebrated with too much cake.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
{/if}

{#if story === 'Horizontal'}
  <Timeline direction="horizontal">
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>Backlog</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="current">
      <TimelineMedia status="current" />
      <TimelineContent>
        <TimelineTitle>In progress</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>Done</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
{/if}

{#if story === 'Compact density'}
  <Timeline density="compact">
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>Comment added</TimelineTitle>
        <TimelineDate>2m ago</TimelineDate>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>Review requested</TimelineTitle>
        <TimelineDate>9m ago</TimelineDate>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineMedia />
      <TimelineContent>
        <TimelineTitle>Merged</TimelineTitle>
        <TimelineDate>21m ago</TimelineDate>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
{/if}
