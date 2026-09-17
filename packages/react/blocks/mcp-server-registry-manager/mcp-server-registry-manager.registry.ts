import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'mcp-server-registry-manager',
  type: 'registry:block',
  categories: ['ai', 'app', 'devops', 'dashboard'],
  description:
    'Anthropic Model Context Protocol (MCP) server registry manager with connection health monitoring, stdio/SSE stream transport metrics, live tool schema explorer, parameterized resource URI templates, and JSON-RPC 2.0 payload inspection drawer.',
  files: [{ path: 'McpServerRegistryManager.tsx', target: 'components/blocks/McpServerRegistryManager.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
