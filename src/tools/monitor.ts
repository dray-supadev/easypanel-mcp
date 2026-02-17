import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerMonitorTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_get_system_stats", "Get system CPU/memory/disk stats", {}, async () =>
    ok(await client.query("monitor.getSystemStats")));

  server.tool("easypanel_get_monitor_table", "Get monitoring data for all services", {}, async () =>
    ok(await client.query("monitor.getMonitorTableData")));

  server.tool("easypanel_get_storage_stats", "Get storage/disk usage stats", {}, async () =>
    ok(await client.query("monitor.getStorageStats")));

  server.tool("easypanel_get_advanced_stats", "Get advanced monitoring stats", {
    ...ps,
  }, async (a) => ok(await client.query("monitor.getAdvancedStats", a)));

  server.tool("easypanel_get_docker_task_stats", "Get Docker task stats", {
    ...ps,
  }, async (a) => ok(await client.query("monitor.getDockerTaskStats", a)));

  server.tool("easypanel_get_service_stats", "Get stats for a specific service", {
    ...ps,
  }, async (a) => ok(await client.query("monitor.getServiceStats", a)));
}
