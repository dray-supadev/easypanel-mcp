import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerBoxTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_box_inspect", "Inspect a box/dev environment", ps, async (a) =>
    ok(await client.query("box.inspectService", a)));

  server.tool("easypanel_box_destroy", "Destroy a box", ps, async (a) =>
    ok(await client.mutation("box.destroyService", a)));

  server.tool("easypanel_box_start", "Start a box", ps, async (a) =>
    ok(await client.mutation("box.startService", a)));

  server.tool("easypanel_box_stop", "Stop a box", ps, async (a) =>
    ok(await client.mutation("box.stopService", a)));

  server.tool("easypanel_box_restart", "Restart a box", ps, async (a) =>
    ok(await client.mutation("box.restartService", a)));

  server.tool("easypanel_box_init", "Initialize a box service", ps, async (a) =>
    ok(await client.mutation("box.initService", a)));

  server.tool("easypanel_box_git_clone", "Clone a Git repo into a box", {
    ...ps, repository: z.string().optional(),
  }, async (a) => ok(await client.mutation("box.gitClone", a)));

  server.tool("easypanel_box_list_presets", "List box presets", {}, async () =>
    ok(await client.query("box.listPresets")));

  server.tool("easypanel_box_load_preset", "Load a preset into a box", {
    ...ps, preset: z.string().optional(),
  }, async (a) => ok(await client.mutation("box.loadPreset", a)));

  server.tool("easypanel_box_rebuild_docker_image", "Rebuild box Docker image", ps, async (a) =>
    ok(await client.mutation("box.rebuildDockerImage", a)));

  server.tool("easypanel_box_refresh_deploy_token", "Refresh box deploy token", ps, async (a) =>
    ok(await client.mutation("box.refreshDeployToken", a)));

  server.tool("easypanel_box_run_deploy_script", "Run box deploy script", ps, async (a) =>
    ok(await client.mutation("box.runDeployScript", a)));

  server.tool("easypanel_box_run_script", "Run a script in box", {
    ...ps, script: z.string().optional(),
  }, async (a) => ok(await client.mutation("box.runScript", a)));

  server.tool("easypanel_box_update_env", "Update box env vars", {
    ...ps, env: z.string(),
  }, async (a) => ok(await client.mutation("box.updateEnv", a)));

  server.tool("easypanel_box_update_basic_auth", "Update box basic auth", {
    ...ps, enabled: z.boolean().optional(), username: z.string().optional(), password: z.string().optional(),
  }, async (a) => ok(await client.mutation("box.updateBasicAuth", a)));

  server.tool("easypanel_box_update_redirects", "Update box redirects", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateRedirects", a)));

  server.tool("easypanel_box_update_resources", "Update box resource limits", {
    ...ps, memoryLimit: z.number().optional(), cpuLimit: z.number().optional(),
  }, async (a) => ok(await client.mutation("box.updateResources", a)));

  server.tool("easypanel_box_update_advanced", "Update box advanced settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateAdvanced", a)));

  server.tool("easypanel_box_update_deploy_script", "Update box deploy script", {
    ...ps, script: z.string().optional(),
  }, async (a) => ok(await client.mutation("box.updateDeployScript", a)));

  server.tool("easypanel_box_update_git_config", "Update box Git config", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateGitConfig", a)));

  server.tool("easypanel_box_update_ide", "Update box IDE settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateIde", a)));

  server.tool("easypanel_box_update_modules", "Update box modules", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateModules", a)));

  server.tool("easypanel_box_update_nginx", "Update box Nginx config", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateNginx", a)));

  server.tool("easypanel_box_update_nodejs", "Update box Node.js settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateNodejs", a)));

  server.tool("easypanel_box_update_php", "Update box PHP settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updatePhp", a)));

  server.tool("easypanel_box_update_processes", "Update box processes", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateProcesses", a)));

  server.tool("easypanel_box_update_python", "Update box Python settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updatePython", a)));

  server.tool("easypanel_box_update_ruby", "Update box Ruby settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateRuby", a)));

  server.tool("easypanel_box_update_scripts", "Update box scripts", {
    ...ps,
  }, async (a) => ok(await client.mutation("box.updateScripts", a)));
}
