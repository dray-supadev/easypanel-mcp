# easypanel-mcp

MCP server for [EasyPanel](https://easypanel.io) — manage your server, projects, services, databases, and domains through any MCP-compatible AI agent.

**342 tools** covering the entire EasyPanel tRPC API (43 namespaces, 347 procedures).

## Quick Start

```bash
npm install
npm run build

export EASYPANEL_URL="http://your-server:3000"
export EASYPANEL_TOKEN="your-api-token"

npm start
```

## MCP Config

```json
{
  "mcpServers": {
    "easypanel": {
      "command": "node",
      "args": ["/path/to/easypanel-mcp/dist/index.js"],
      "env": {
        "EASYPANEL_URL": "http://your-server:3000",
        "EASYPANEL_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| **Projects** | 9 | Create, inspect, destroy projects |
| **App Services** | 21 | Deploy, start, stop, configure apps |
| **Compose** | 15 | Docker Compose services |
| **Box (DevBox)** | 29 | IDE-in-browser dev environments |
| **WordPress** | 49 | Full WP management (plugins, themes, users, DB) |
| **Databases** | 60 | Postgres, MySQL, MariaDB, MongoDB, Redis |
| **Domains** | 6 | Domain management and SSL |
| **Monitoring** | 5 | System stats, service stats, storage |
| **Cloudflare Tunnel** | 11 | Tunnel management |
| **Backups** | 12 | Database & volume backups |
| **Branding** | 12 | Panel customization |
| **Settings** | 20+ | Panel config, Docker cleanup, updates |
| **Users & Auth** | 8 | User management, API tokens, 2FA |
| **Raw tRPC** | 1 | Direct access to any procedure |

## Getting an API Token

1. Log into EasyPanel UI
2. Go to Settings → Generate API Token

Or via CLI:
```bash
curl -X POST http://your-server:3000/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"json":{"email":"admin@example.com","password":"your-password"}}'
# Returns: {"result":{"data":{"json":{"token":"your-token"}}}}
```

## Raw tRPC Access

For any procedure not covered by a dedicated tool, use `easypanel_trpc_raw`:

```
procedure: "cloudflareTunnel.listZones"
input: {}
isMutation: false
```

All 347 EasyPanel tRPC procedures are accessible.

## How It Works

EasyPanel exposes a tRPC API at `/api/trpc/`. This MCP server was built by reverse-engineering EasyPanel's frontend to extract all procedure names and input schemas, then mapping each to an MCP tool with proper Zod validation.

## License

MIT
