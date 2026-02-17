import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerWordPressTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_wp_inspect", "Inspect WordPress service", ps, async (a) =>
    ok(await client.query("wordpress.inspectService", a)));

  server.tool("easypanel_wp_destroy", "Destroy WordPress service", ps, async (a) =>
    ok(await client.mutation("wordpress.destroyService", a)));

  server.tool("easypanel_wp_start", "Start WordPress service", ps, async (a) =>
    ok(await client.mutation("wordpress.startService", a)));

  server.tool("easypanel_wp_stop", "Stop WordPress service", ps, async (a) =>
    ok(await client.mutation("wordpress.stopService", a)));

  server.tool("easypanel_wp_restart", "Restart WordPress service", ps, async (a) =>
    ok(await client.mutation("wordpress.restartService", a)));

  server.tool("easypanel_wp_rebuild_docker_image", "Rebuild WordPress Docker image", ps, async (a) =>
    ok(await client.mutation("wordpress.rebuildDockerImage", a)));

  server.tool("easypanel_wp_git_clone", "Clone Git repo into WordPress", {
    ...ps, repository: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.gitClone", a)));

  server.tool("easypanel_wp_run_script", "Run a script in WordPress", {
    ...ps, script: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.runScript", a)));

  server.tool("easypanel_wp_update_env", "Update WordPress env vars", {
    ...ps, env: z.string(),
  }, async (a) => ok(await client.mutation("wordpress.updateEnv", a)));

  server.tool("easypanel_wp_update_basic_auth", "Update WordPress basic auth", {
    ...ps, enabled: z.boolean().optional(), username: z.string().optional(), password: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.updateBasicAuth", a)));

  server.tool("easypanel_wp_update_redirects", "Update WordPress redirects", {
    ...ps,
  }, async (a) => ok(await client.mutation("wordpress.updateRedirects", a)));

  server.tool("easypanel_wp_update_resources", "Update WordPress resource limits", {
    ...ps, memoryLimit: z.number().optional(), cpuLimit: z.number().optional(),
  }, async (a) => ok(await client.mutation("wordpress.updateResources", a)));

  server.tool("easypanel_wp_update_php", "Update WordPress PHP settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("wordpress.updatePhp", a)));

  server.tool("easypanel_wp_update_nginx", "Update WordPress Nginx config", {
    ...ps,
  }, async (a) => ok(await client.mutation("wordpress.updateNginx", a)));

  server.tool("easypanel_wp_update_ide", "Update WordPress IDE settings", {
    ...ps,
  }, async (a) => ok(await client.mutation("wordpress.updateIde", a)));

  server.tool("easypanel_wp_update_git_config", "Update WordPress Git config", {
    ...ps,
  }, async (a) => ok(await client.mutation("wordpress.updateGitConfig", a)));

  server.tool("easypanel_wp_update_scripts", "Update WordPress scripts", {
    ...ps,
  }, async (a) => ok(await client.mutation("wordpress.updateScripts", a)));

  server.tool("easypanel_wp_update_wp_config", "Update wp-config.php", {
    ...ps,
  }, async (a) => ok(await client.mutation("wordpress.updateWpConfig", a)));

  server.tool("easypanel_wp_update_wp_core", "Update WordPress core", ps, async (a) =>
    ok(await client.mutation("wordpress.updateWpCore", a)));

  server.tool("easypanel_wp_get_wp_config", "Get wp-config.php", ps, async (a) =>
    ok(await client.query("wordpress.getWpConfig", a)));

  server.tool("easypanel_wp_get_plugins", "Get WordPress plugins", ps, async (a) =>
    ok(await client.query("wordpress.getPlugins", a)));

  server.tool("easypanel_wp_search_plugin", "Search WordPress plugins", {
    ...ps, query: z.string(),
  }, async (a) => ok(await client.query("wordpress.searchPlugin", a)));

  server.tool("easypanel_wp_install_plugin", "Install WordPress plugin", {
    ...ps, slug: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.installPlugin", a)));

  server.tool("easypanel_wp_activate_plugin", "Activate WordPress plugin", {
    ...ps, plugin: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.activatePlugin", a)));

  server.tool("easypanel_wp_deactivate_plugin", "Deactivate WordPress plugin", {
    ...ps, plugin: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.deactivatePlugin", a)));

  server.tool("easypanel_wp_get_themes", "Get WordPress themes", ps, async (a) =>
    ok(await client.query("wordpress.getThemes", a)));

  server.tool("easypanel_wp_search_theme", "Search WordPress themes", {
    ...ps, query: z.string(),
  }, async (a) => ok(await client.query("wordpress.searchTheme", a)));

  server.tool("easypanel_wp_install_theme", "Install WordPress theme", {
    ...ps, slug: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.installTheme", a)));

  server.tool("easypanel_wp_activate_theme", "Activate WordPress theme", {
    ...ps, theme: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.activateTheme", a)));

  server.tool("easypanel_wp_get_users", "Get WordPress users", ps, async (a) =>
    ok(await client.query("wordpress.getUsers", a)));

  server.tool("easypanel_wp_create_user", "Create WordPress user", {
    ...ps, username: z.string().optional(), email: z.string().optional(), password: z.string().optional(), role: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.createUser", a)));

  server.tool("easypanel_wp_update_user", "Update WordPress user", {
    ...ps, userId: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.updateUser", a)));

  server.tool("easypanel_wp_delete_user", "Delete WordPress user", {
    ...ps, userId: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.deleteUser", a)));

  server.tool("easypanel_wp_get_roles", "Get WordPress roles", ps, async (a) =>
    ok(await client.query("wordpress.getRoles", a)));

  server.tool("easypanel_wp_create_role", "Create WordPress role", {
    ...ps, name: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.createRole", a)));

  server.tool("easypanel_wp_delete_role", "Delete WordPress role", {
    ...ps, role: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.deleteRole", a)));

  server.tool("easypanel_wp_get_options", "Get WordPress options", ps, async (a) =>
    ok(await client.query("wordpress.getOptions", a)));

  server.tool("easypanel_wp_create_option", "Create WordPress option", {
    ...ps, key: z.string().optional(), value: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.createOption", a)));

  server.tool("easypanel_wp_update_option", "Update WordPress option", {
    ...ps, key: z.string().optional(), value: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.updateOption", a)));

  server.tool("easypanel_wp_delete_option", "Delete WordPress option", {
    ...ps, key: z.string().optional(),
  }, async (a) => ok(await client.mutation("wordpress.deleteOption", a)));

  server.tool("easypanel_wp_get_profile", "Get WordPress profile", ps, async (a) =>
    ok(await client.query("wordpress.getProfile", a)));

  server.tool("easypanel_wp_get_maintenance_mode", "Get WordPress maintenance mode", ps, async (a) =>
    ok(await client.query("wordpress.getMaintenanceMode", a)));

  server.tool("easypanel_wp_update_maintenance_mode", "Update WordPress maintenance mode", {
    ...ps, enabled: z.boolean().optional(),
  }, async (a) => ok(await client.mutation("wordpress.updateMaintenanceMode", a)));

  server.tool("easypanel_wp_flush_cache", "Flush WordPress cache", ps, async (a) =>
    ok(await client.mutation("wordpress.flushCache", a)));

  server.tool("easypanel_wp_db_optimize", "Optimize WordPress database", ps, async (a) =>
    ok(await client.mutation("wordpress.dbOptimize", a)));

  server.tool("easypanel_wp_delete_transient", "Delete WordPress transients", ps, async (a) =>
    ok(await client.mutation("wordpress.deleteTransient", a)));

  server.tool("easypanel_wp_media_regenerate", "Regenerate WordPress media thumbnails", ps, async (a) =>
    ok(await client.mutation("wordpress.mediaRegenerate", a)));

  server.tool("easypanel_wp_search_replace", "WordPress search & replace in DB", {
    ...ps, search: z.string(), replace: z.string(),
  }, async (a) => ok(await client.mutation("wordpress.searchReplace", a)));

  server.tool("easypanel_wp_search_replace_dry_run", "WordPress search & replace dry run", {
    ...ps, search: z.string(), replace: z.string(),
  }, async (a) => ok(await client.mutation("wordpress.searchReplaceDryRun", a)));
}
