import Story from '../../components/story/Story'
import { McpServerRegistryManager } from '@react-registry-blocks/mcp-server-registry-manager/McpServerRegistryManager'

export default function McpServerRegistryManagerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Anthropic Model Context Protocol (MCP) server manager featuring connection health monitoring, 4 system KPI metrics, stdio and SSE transport protocols, parameterized resource URI templates, and live JSON-RPC tool schema inspection."
      >
        <McpServerRegistryManager />
      </Story>

      <Story
        title="Filtered by SSE Stream"
        description="Shows remote HTTP Server-Sent Events (SSE) streaming gateways for edge deployment and web search tools."
      >
        <McpServerRegistryManager initialTransportFilter="sse" />
      </Story>

      <Story
        title="Tool Schema Drawer Opened"
        description="Pre-opened tool schema inspection drawer showcasing parameter definitions, types, descriptions, and JSON-RPC 2.0 payloads for query_docs."
      >
        <McpServerRegistryManager initialSelectedToolName="query_docs" initialDrawerOpen={true} />
      </Story>

      <Story
        title="Diagnostic Handshake Verified"
        description="Shows the active system handshake status banner confirming response latency and protocol conformity across all servers."
      >
        <McpServerRegistryManager initialHandshakeAlert={true} />
      </Story>

      <Story
        title="Filtered by Database & SQL Tools"
        description="Pre-populated search query targeting the PostgreSQL query inspector and EXPLAIN ANALYZE tools."
      >
        <McpServerRegistryManager initialSearch="postgres" />
      </Story>

      <Story
        title="Install Server Dialog Opened"
        description="New MCP server registration dialog with stdio command and SSE gateway configuration fields."
      >
        <McpServerRegistryManager initialInstallDialogOpen={true} />
      </Story>

      <Story
        title="Empty Registry State"
        description="Initial state when no MCP servers are registered, with CTA to configure the first tool connection."
      >
        <McpServerRegistryManager initialServers={[]} />
      </Story>
    </>
  )
}
