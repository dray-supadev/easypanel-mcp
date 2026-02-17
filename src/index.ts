#!/usr/bin/env node
/**
 * EasyPanel MCP Server
 *
 * Exposes EasyPanel's 347 tRPC procedures as MCP tools.
 *
 * Config via env:
 *   EASYPANEL_URL     - Panel URL (e.g. http://45.145.168.205:3000)
 *   EASYPANEL_TOKEN   - API token (from panel → users → generate token)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { EasyPanelClient } from "./client.js";
import { ok } from "./tools/helpers.js";

import { registerProjectTools } from "./tools/projects.js";
import { registerAppTools } from "./tools/app.js";
import { registerAuthTools } from "./tools/auth.js";
import { registerDatabaseTools } from "./tools/databases.js";
import { registerDomainTools } from "./tools/domains.js";
import { registerMonitorTools } from "./tools/monitor.js";
import { registerSettingsTools } from "./tools/settings.js";
import { registerComposeTools } from "./tools/compose.js";
import { registerBoxTools } from "./tools/box.js";
import { registerWordPressTools } from "./tools/wordpress.js";
import { registerInfrastructureTools } from "./tools/infrastructure.js";
import { registerCloudflareTools } from "./tools/cloudflare.js";
import { registerBrandingTools } from "./tools/branding.js";
import { registerBackupTools } from "./tools/backups.js";
import { registerBackupProviderTools } from "./tools/backup-providers.js";
import { registerAdminTools } from "./tools/admin.js";

const EP_URL = process.env.EASYPANEL_URL;
const EP_TOKEN = process.env.EASYPANEL_TOKEN;

if (!EP_URL) {
  console.error("EASYPANEL_URL is required");
  process.exit(1);
}
if (!EP_TOKEN) {
  console.error("EASYPANEL_TOKEN is required");
  process.exit(1);
}

const client = new EasyPanelClient(EP_URL, EP_TOKEN);

const server = new McpServer({
  name: "easypanel",
  version: "0.1.0",
});

// Register all tool modules
registerProjectTools(server, client);
registerAppTools(server, client);
registerAuthTools(server, client);
registerDatabaseTools(server, client);
registerDomainTools(server, client);
registerMonitorTools(server, client);
registerSettingsTools(server, client);
registerComposeTools(server, client);
registerBoxTools(server, client);
registerWordPressTools(server, client);
registerInfrastructureTools(server, client);
registerCloudflareTools(server, client);
registerBrandingTools(server, client);
registerBackupTools(server, client);
registerBackupProviderTools(server, client);
registerAdminTools(server, client);

// Raw tRPC escape hatch
server.tool(
  "easypanel_trpc_raw",
  "Call any EasyPanel tRPC procedure directly. 347 procedures available across 43 namespaces.",
  {
    procedure: z.string().describe("tRPC procedure (e.g. 'projects.listProjects')"),
    input: z.record(z.string(), z.unknown()).optional().describe("Input object"),
    isMutation: z.boolean().optional().describe("true for mutations, false for queries (default)"),
  },
  async ({ procedure, input, isMutation }) => {
    try {
      const result = isMutation
        ? await client.mutation(procedure, input ?? {})
        : await client.query(procedure, input as any);
      return ok(result);
    } catch (err: any) {
      return { content: [{ type: "text" as const, text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Start
const transport = new StdioServerTransport();
await server.connect(transport);
