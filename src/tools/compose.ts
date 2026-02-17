import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerComposeTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_compose_inspect", "Inspect compose service", ps, async (a) =>
    ok(await client.query("compose.inspectService", a)));

  server.tool("easypanel_compose_deploy", "Deploy compose service", ps, async (a) =>
    ok(await client.mutation("compose.deployService", a)));

  server.tool("easypanel_compose_destroy", "Destroy compose service", ps, async (a) =>
    ok(await client.mutation("compose.destroyService", a)));

  server.tool("easypanel_compose_start", "Start compose service", ps, async (a) =>
    ok(await client.mutation("compose.startService", a)));

  server.tool("easypanel_compose_stop", "Stop compose service", ps, async (a) =>
    ok(await client.mutation("compose.stopService", a)));

  server.tool("easypanel_compose_restart", "Restart compose service", ps, async (a) =>
    ok(await client.mutation("compose.restartService", a)));

  server.tool("easypanel_compose_update_env", "Update compose env vars", {
    ...ps, env: z.string(),
  }, async (a) => ok(await client.mutation("compose.updateEnv", a)));

  server.tool("easypanel_compose_update_source_git", "Update compose Git source", {
    ...ps, repository: z.string().optional(), branch: z.string().optional(),
  }, async (a) => ok(await client.mutation("compose.updateSourceGit", a)));

  server.tool("easypanel_compose_update_source_inline", "Update compose inline source", {
    ...ps, composeFile: z.string().optional(),
  }, async (a) => ok(await client.mutation("compose.updateSourceInline", a)));

  server.tool("easypanel_compose_update_basic_auth", "Update compose basic auth", {
    ...ps, enabled: z.boolean().optional(), username: z.string().optional(), password: z.string().optional(),
  }, async (a) => ok(await client.mutation("compose.updateBasicAuth", a)));

  server.tool("easypanel_compose_update_maintenance", "Toggle compose maintenance mode", {
    ...ps, enabled: z.boolean().optional(),
  }, async (a) => ok(await client.mutation("compose.updateMaintenance", a)));

  server.tool("easypanel_compose_update_redirects", "Update compose redirects", {
    ...ps, redirects: z.array(z.object({ regex: z.string(), replacement: z.string(), permanent: z.boolean().optional() })).optional(),
  }, async (a) => ok(await client.mutation("compose.updateRedirects", a)));

  server.tool("easypanel_compose_get_docker_services", "Get Docker services for compose", ps, async (a) =>
    ok(await client.query("compose.getDockerServices", a)));

  server.tool("easypanel_compose_get_issues", "Get compose issues", ps, async (a) =>
    ok(await client.query("compose.getIssues", a)));

  server.tool("easypanel_compose_refresh_deploy_token", "Refresh compose deploy token", ps, async (a) =>
    ok(await client.mutation("compose.refreshDeployToken", a)));
}
