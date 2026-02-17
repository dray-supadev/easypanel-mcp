#!/usr/bin/env node
/**
 * EasyPanel MCP Server
 * 
 * ~40 curated tools for the most common operations + trpc_raw for everything else.
 * Covers 347 tRPC procedures total.
 *
 * Env:
 *   EASYPANEL_URL   - Panel URL
 *   EASYPANEL_TOKEN - API token
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { EasyPanelClient } from "./client.js";

const EP_URL = process.env.EASYPANEL_URL;
const EP_TOKEN = process.env.EASYPANEL_TOKEN;

if (!EP_URL) { console.error("EASYPANEL_URL required"); process.exit(1); }
if (!EP_TOKEN) { console.error("EASYPANEL_TOKEN required"); process.exit(1); }

const client = new EasyPanelClient(EP_URL, EP_TOKEN);
const server = new McpServer({ name: "easypanel", version: "0.2.0" });

function ok(r: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(r, null, 2) }] };
}
function err(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text" as const, text: `Error: ${msg}` }], isError: true as const };
}
const READONLY = (process.env.MCP_ACCESS_MODE || "full").toLowerCase() === "readonly";

async function q(proc: string, input?: Record<string, unknown>) {
  try { return ok(await client.query(proc, input as any)); } catch (e) { return err(e); }
}
async function m(proc: string, input?: Record<string, unknown>) {
  if (READONLY) return { content: [{ type: "text" as const, text: "Error: Read-only mode. Mutations are disabled (MCP_ACCESS_MODE=readonly)." }], isError: true as const };
  try { return ok(await client.mutation(proc, input ?? {})); } catch (e) { return err(e); }
}

const ps = {
  projectName: z.string().describe("Project name"),
  serviceName: z.string().describe("Service name"),
};

// ===================== PROJECTS =====================

server.tool("list_projects", "List all projects and their services", {},
  async () => q("projects.listProjectsAndServices"));

server.tool("create_project", "Create a new project", {
  name: z.string().describe("Project name (lowercase, no spaces)"),
}, async ({ name }) => m("projects.createProject", { name }));

server.tool("destroy_project", "Delete a project and all its services", {
  projectName: z.string(),
}, async (a) => m("projects.destroyProject", a));

server.tool("inspect_project", "Get project details and Docker containers", {
  projectName: z.string(),
}, async (a) => q("projects.inspectProject", a));

// ===================== APP SERVICES =====================

server.tool("create_app", "Create an app service", {
  ...ps,
}, async (a) => m("app.createService", a));

server.tool("inspect_app", "Get app service details (env, domains, build, source)", {
  ...ps,
}, async (a) => q("app.inspectService", a));

server.tool("deploy_app", "Trigger deployment for an app", {
  ...ps,
}, async (a) => m("app.deployService", a));

server.tool("start_app", "Start an app service", { ...ps },
  async (a) => m("app.startService", a));

server.tool("stop_app", "Stop an app service", { ...ps },
  async (a) => m("app.stopService", a));

server.tool("restart_app", "Restart an app service", { ...ps },
  async (a) => m("app.restartService", a));

server.tool("destroy_app", "Delete an app service", { ...ps },
  async (a) => m("app.destroyService", a));

server.tool("set_app_source_image", "Set app source to a Docker image", {
  ...ps,
  image: z.string().describe("Docker image (e.g. nginx:latest)"),
}, async (a) => m("app.updateSourceImage", a));

server.tool("set_app_source_github", "Set app source to a GitHub repo", {
  ...ps,
  owner: z.string(), repo: z.string(),
  branch: z.string().optional(),
  path: z.string().optional().describe("Subdirectory"),
}, async (a) => m("app.updateSourceGithub", a));

server.tool("set_app_env", "Update environment variables for an app", {
  ...ps,
  env: z.string().describe("KEY=VALUE lines"),
}, async (a) => m("app.updateEnv", a));

server.tool("set_app_resources", "Set CPU/memory limits for an app", {
  ...ps,
  memoryLimit: z.number().optional().describe("Memory limit MB"),
  memoryReservation: z.number().optional().describe("Memory reservation MB"),
  cpuLimit: z.number().optional().describe("CPU limit (1 = 1 core)"),
  cpuReservation: z.number().optional().describe("CPU reservation"),
}, async (a) => m("app.updateResources", a));

// ===================== DATABASES =====================

server.tool("create_database", "Create a database service", {
  ...ps,
  engine: z.enum(["postgres", "mysql", "mariadb", "mongo", "redis"]),
  password: z.string().optional().describe("Password (auto-generated if empty)"),
}, async ({ engine, ...rest }) => m(`${engine}.createService`, rest));

server.tool("inspect_database", "Get database service info (connection string, status)", {
  ...ps,
  engine: z.enum(["postgres", "mysql", "mariadb", "mongo", "redis"]),
}, async ({ engine, ...rest }) => q(`${engine}.inspectService`, rest));

server.tool("destroy_database", "Delete a database service", {
  ...ps,
  engine: z.enum(["postgres", "mysql", "mariadb", "mongo", "redis"]),
}, async ({ engine, ...rest }) => m(`${engine}.destroyService`, rest));

// ===================== DOMAINS =====================

server.tool("list_domains", "List domains for a service", { ...ps },
  async (a) => q("domains.listDomains", a));

server.tool("create_domain", "Add a domain to a service", {
  ...ps,
  host: z.string().describe("Domain (e.g. app.example.com)"),
  https: z.boolean().optional().describe("Enable HTTPS (default true)"),
  port: z.number().optional().describe("Container port"),
}, async (a) => m("domains.createDomain", a));

server.tool("delete_domain", "Remove a domain from a service", {
  ...ps,
  domainId: z.string(),
}, async (a) => m("domains.deleteDomain", a));

// ===================== PORTS =====================

server.tool("create_port", "Expose a port for a service", {
  ...ps,
  publishedPort: z.number().describe("External port"),
  targetPort: z.number().describe("Container port"),
  protocol: z.enum(["tcp", "udp"]).optional(),
}, async (a) => m("ports.createPort", a));

server.tool("list_ports", "List exposed ports for a service", { ...ps },
  async (a) => q("ports.listPorts", a));

// ===================== MOUNTS =====================

server.tool("create_mount", "Create a volume mount for a service", {
  ...ps,
  mountPath: z.string().describe("Path inside container"),
  name: z.string().optional().describe("Volume name"),
  hostPath: z.string().optional().describe("Host path for bind mount"),
}, async (a) => m("mounts.createMount", a));

server.tool("list_mounts", "List volume mounts for a service", { ...ps },
  async (a) => q("mounts.listMounts", a));

// ===================== MONITORING =====================

server.tool("system_stats", "Get system stats (CPU, memory, disk, network)", {},
  async () => q("monitor.getSystemStats"));

server.tool("service_stats", "Get resource stats for a service", { ...ps },
  async (a) => q("monitor.getServiceStats", a));

server.tool("storage_stats", "Get storage usage breakdown", {},
  async () => q("monitor.getStorageStats"));

// ===================== COMPOSE =====================

server.tool("create_compose", "Create a Docker Compose service", { ...ps },
  async (a) => m("compose.createService", a));

server.tool("inspect_compose", "Get compose service details", { ...ps },
  async (a) => q("compose.inspectService", a));

server.tool("deploy_compose", "Deploy a compose service", { ...ps },
  async (a) => m("compose.deployService", a));

// ===================== SYSTEM =====================

server.tool("cleanup_docker", "Clean up unused Docker images", {},
  async () => m("settings.cleanupDockerImages"));

server.tool("system_prune", "Docker system prune (remove all unused data)", {},
  async () => m("settings.systemPrune"));

server.tool("restart_panel", "Restart EasyPanel", {},
  async () => m("settings.restartEasypanel"));

server.tool("reboot_server", "Reboot the server", {},
  async () => m("server.reboot"));

server.tool("list_users", "List panel users", {},
  async () => q("users.listUsers"));

server.tool("list_certificates", "List SSL certificates", {},
  async () => q("certificates.listCertificates"));

server.tool("list_nodes", "List cluster nodes", {},
  async () => q("cluster.listNodes"));

server.tool("deploy_template", "Deploy from an EasyPanel one-click template", {
  projectName: z.string(),
  schema: z.record(z.string(), z.unknown()).describe("Template schema object"),
}, async (a) => m("templates.createFromSchema", a));

// ===================== RAW tRPC =====================

server.tool("trpc_raw", "Call any EasyPanel tRPC procedure directly. 347 procedures across 43 namespaces. Use for anything not covered above. Examples: wordpress.getPlugins, box.createService, traefik.getDashboard, branding.getBasicSettings, cloudflareTunnel.listTunnels", {
  procedure: z.string().describe("Full tRPC procedure name (e.g. 'wordpress.inspectService')"),
  input: z.record(z.string(), z.unknown()).optional(),
  isMutation: z.boolean().optional().describe("true for write operations, false for reads (default)"),
}, async ({ procedure, input, isMutation }) => {
  try {
    const result = isMutation
      ? await client.mutation(procedure, input ?? {})
      : await client.query(procedure, input as any);
    return ok(result);
  } catch (e) { return err(e); }
});

// Start in HTTP or stdio mode
const mode = process.env.EASYPANEL_MCP_MODE || "stdio";
const port = parseInt(process.env.PORT || "3100", 10);

if (mode === "http") {
  const { startHttpServer } = await import("./http-server.js");
  await startHttpServer(server, port);
} else {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
