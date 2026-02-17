import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerAppTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_app_inspect", "Inspect an app service", ps, async (a) =>
    ok(await client.query("app.inspectService", a)));

  server.tool("easypanel_app_deploy", "Deploy an app service", ps, async (a) =>
    ok(await client.mutation("app.deployService", a)));

  server.tool("easypanel_app_start", "Start an app service", ps, async (a) =>
    ok(await client.mutation("app.startService", a)));

  server.tool("easypanel_app_stop", "Stop an app service", ps, async (a) =>
    ok(await client.mutation("app.stopService", a)));

  server.tool("easypanel_app_restart", "Restart an app service", ps, async (a) =>
    ok(await client.mutation("app.restartService", a)));

  server.tool("easypanel_app_destroy", "Destroy an app service", ps, async (a) =>
    ok(await client.mutation("app.destroyService", a)));

  server.tool("easypanel_app_update_env", "Update app env vars", {
    ...ps, env: z.string().describe("KEY=VALUE lines"),
  }, async (a) => ok(await client.mutation("app.updateEnv", a)));

  server.tool("easypanel_app_update_source_image", "Update app Docker image source", {
    ...ps, image: z.string(), username: z.string().optional(), password: z.string().optional(),
  }, async (a) => ok(await client.mutation("app.updateSourceImage", a)));

  server.tool("easypanel_app_update_source_git", "Update app Git source", {
    ...ps, repository: z.string().optional(), branch: z.string().optional(), buildPath: z.string().optional(),
  }, async (a) => ok(await client.mutation("app.updateSourceGit", a)));

  server.tool("easypanel_app_update_source_github", "Update app GitHub source", {
    ...ps, owner: z.string().optional(), repo: z.string().optional(), branch: z.string().optional(), buildPath: z.string().optional(),
  }, async (a) => ok(await client.mutation("app.updateSourceGithub", a)));

  server.tool("easypanel_app_update_source_dockerfile", "Update app Dockerfile source", {
    ...ps, dockerfile: z.string().optional(),
  }, async (a) => ok(await client.mutation("app.updateSourceDockerfile", a)));

  server.tool("easypanel_app_update_build", "Update app build settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("app.updateBuild", a)));

  server.tool("easypanel_app_update_deploy", "Update app deploy settings", {
    ...ps, replicas: z.number().optional(), command: z.string().optional(), zeroDowntime: z.boolean().optional(),
  }, async (a) => ok(await client.mutation("app.updateDeploy", a)));

  server.tool("easypanel_app_update_resources", "Update app resource limits", {
    ...ps, memoryLimit: z.number().optional(), memoryReservation: z.number().optional(), cpuLimit: z.number().optional(), cpuReservation: z.number().optional(),
  }, async (a) => ok(await client.mutation("app.updateResources", a)));

  server.tool("easypanel_app_update_basic_auth", "Update app basic auth", {
    ...ps, enabled: z.boolean().optional(), username: z.string().optional(), password: z.string().optional(),
  }, async (a) => ok(await client.mutation("app.updateBasicAuth", a)));

  server.tool("easypanel_app_update_maintenance", "Enable/disable app maintenance mode", {
    ...ps, enabled: z.boolean().optional(),
  }, async (a) => ok(await client.mutation("app.updateMaintenance", a)));

  server.tool("easypanel_app_update_redirects", "Update app redirects", {
    ...ps, redirects: z.array(z.object({ regex: z.string(), replacement: z.string(), permanent: z.boolean().optional() })).optional(),
  }, async (a) => ok(await client.mutation("app.updateRedirects", a)));

  server.tool("easypanel_app_get_exposed_ports", "Get app exposed ports", ps, async (a) =>
    ok(await client.query("app.getExposedPorts", a)));

  server.tool("easypanel_app_refresh_deploy_token", "Refresh app deploy token", ps, async (a) =>
    ok(await client.mutation("app.refreshDeployToken", a)));

  server.tool("easypanel_app_enable_github_deploy", "Enable GitHub deploy for app", ps, async (a) =>
    ok(await client.mutation("app.enableGithubDeploy", a)));

  server.tool("easypanel_app_disable_github_deploy", "Disable GitHub deploy for app", ps, async (a) =>
    ok(await client.mutation("app.disableGithubDeploy", a)));
}
