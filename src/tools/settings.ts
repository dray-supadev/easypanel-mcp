import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ok } from "./helpers.js";

export function registerSettingsTools(server: McpServer, client: EasyPanelClient) {
  // === SETTINGS ===
  server.tool("easypanel_get_server_ip", "Get server IP", {}, async () =>
    ok(await client.query("settings.getServerIp")));

  server.tool("easypanel_get_panel_domain", "Get panel domain", {}, async () =>
    ok(await client.query("settings.getPanelDomain")));

  server.tool("easypanel_set_panel_domain", "Set panel domain", {
    domain: z.string(),
  }, async (a) => ok(await client.mutation("settings.setPanelDomain", a)));

  server.tool("easypanel_get_docker_version", "Get Docker version", {}, async () =>
    ok(await client.query("settings.getDockerVersion")));

  server.tool("easypanel_get_letsencrypt_email", "Get Let's Encrypt email", {}, async () =>
    ok(await client.query("settings.getLetsEncryptEmail")));

  server.tool("easypanel_set_letsencrypt_email", "Set Let's Encrypt email", {
    email: z.string(),
  }, async (a) => ok(await client.mutation("settings.setLetsEncryptEmail", a)));

  server.tool("easypanel_get_github_token", "Get GitHub token", {}, async () =>
    ok(await client.query("settings.getGithubToken")));

  server.tool("easypanel_set_github_token", "Set GitHub token", {
    token: z.string(),
  }, async (a) => ok(await client.mutation("settings.setGithubToken", a)));

  server.tool("easypanel_get_service_domain", "Get default service domain", {}, async () =>
    ok(await client.query("settings.getServiceDomain")));

  server.tool("easypanel_set_service_domain", "Set default service domain", {
    domain: z.string(),
  }, async (a) => ok(await client.mutation("settings.setServiceDomain", a)));

  server.tool("easypanel_get_daily_docker_cleanup", "Get daily Docker cleanup setting", {}, async () =>
    ok(await client.query("settings.getDailyDockerCleanup")));

  server.tool("easypanel_set_daily_docker_cleanup", "Set daily Docker cleanup", {
    enabled: z.boolean(),
  }, async (a) => ok(await client.mutation("settings.setDailyDockerCleanup", a)));

  server.tool("easypanel_get_demo_mode", "Check if demo mode is enabled", {}, async () =>
    ok(await client.query("settings.getDemoMode")));

  server.tool("easypanel_get_ga_measurement_id", "Get Google Analytics measurement ID", {}, async () =>
    ok(await client.query("settings.getGoogleAnalyticsMeasurementId")));

  server.tool("easypanel_set_ga_measurement_id", "Set Google Analytics measurement ID", {
    measurementId: z.string(),
  }, async (a) => ok(await client.mutation("settings.setGoogleAnalyticsMeasurementId", a)));

  server.tool("easypanel_refresh_server_ip", "Refresh server IP", {}, async () =>
    ok(await client.mutation("settings.refreshServerIp", {})));

  server.tool("easypanel_change_credentials", "Change admin credentials", {
    email: z.string().optional(), password: z.string().optional(),
  }, async (a) => ok(await client.mutation("settings.changeCredentials", a)));

  server.tool("easypanel_check_docker_update", "Check for Docker updates", {}, async () =>
    ok(await client.mutation("settings.checkDockerUpdate", {})));

  server.tool("easypanel_check_for_updates", "Check for EasyPanel updates", {}, async () =>
    ok(await client.mutation("settings.checkForUpdates", {})));

  server.tool("easypanel_cleanup_docker_builder", "Cleanup Docker builder cache", {}, async () =>
    ok(await client.mutation("settings.cleanupDockerBuilder", {})));

  server.tool("easypanel_cleanup_docker_images", "Cleanup unused Docker images", {}, async () =>
    ok(await client.mutation("settings.cleanupDockerImages", {})));

  server.tool("easypanel_restart_easypanel", "Restart EasyPanel", {}, async () =>
    ok(await client.mutation("settings.restartEasypanel", {})));

  server.tool("easypanel_system_prune", "Docker system prune", {}, async () =>
    ok(await client.mutation("settings.systemPrune", {})));

  // === SERVER ===
  server.tool("easypanel_server_reboot", "Reboot the server", {}, async () =>
    ok(await client.mutation("server.reboot", {})));

  // === SETUP ===
  server.tool("easypanel_setup_get_status", "Get setup status", {}, async () =>
    ok(await client.query("setup.getStatus")));

  server.tool("easypanel_setup", "Run initial setup", {
    email: z.string(), password: z.string(),
  }, async (a) => ok(await client.mutation("setup.setup", a)));

  // === UPDATE ===
  server.tool("easypanel_update_get_status", "Get update status", {}, async () =>
    ok(await client.query("update.getStatus")));

  server.tool("easypanel_update", "Run EasyPanel update", {}, async () =>
    ok(await client.mutation("update.update", {})));

  // === TWO FACTOR ===
  server.tool("easypanel_2fa_configure", "Configure 2FA", {}, async () =>
    ok(await client.mutation("twoFactor.configure", {})));

  server.tool("easypanel_2fa_enable", "Enable 2FA", {
    code: z.string(),
  }, async (a) => ok(await client.mutation("twoFactor.enable", a)));

  server.tool("easypanel_2fa_disable", "Disable 2FA", {
    code: z.string(),
  }, async (a) => ok(await client.mutation("twoFactor.disable", a)));

  // === LEMON LICENSE ===
  server.tool("easypanel_lemon_get_license", "Get Lemon license payload", {}, async () =>
    ok(await client.query("lemonLicense.getLicensePayload")));

  server.tool("easypanel_lemon_activate", "Activate Lemon license", {
    licenseKey: z.string(),
  }, async (a) => ok(await client.mutation("lemonLicense.activate", a)));

  server.tool("easypanel_lemon_activate_by_order", "Activate Lemon license by order", {
    orderId: z.string(),
  }, async (a) => ok(await client.mutation("lemonLicense.activateByOrder", a)));

  server.tool("easypanel_lemon_deactivate", "Deactivate Lemon license", {}, async () =>
    ok(await client.mutation("lemonLicense.deactivate", {})));

  // === PORTAL LICENSE ===
  server.tool("easypanel_portal_get_license", "Get Portal license payload", {}, async () =>
    ok(await client.query("portalLicense.getLicensePayload")));

  server.tool("easypanel_portal_activate", "Activate Portal license", {
    licenseKey: z.string(),
  }, async (a) => ok(await client.mutation("portalLicense.activate", a)));

  server.tool("easypanel_portal_deactivate", "Deactivate Portal license", {}, async () =>
    ok(await client.mutation("portalLicense.deactivate", {})));
}
