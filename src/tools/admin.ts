import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ok } from "./helpers.js";

export function registerAdminTools(server: McpServer, client: EasyPanelClient) {
  // === NOTIFICATIONS ===
  server.tool("easypanel_list_notifications", "List notification channels", {}, async () =>
    ok(await client.query("notifications.listNotificationChannels")));

  server.tool("easypanel_create_notification", "Create a notification channel", {
    type: z.string(), name: z.string(),
  }, async (a) => ok(await client.mutation("notifications.createNotificationChannel", a)));

  server.tool("easypanel_destroy_notification", "Destroy a notification channel", {
    channelId: z.string(),
  }, async (a) => ok(await client.mutation("notifications.destroyNotificationChannel", a)));

  server.tool("easypanel_update_notification", "Update a notification channel", {
    channelId: z.string(), name: z.string().optional(),
  }, async (a) => ok(await client.mutation("notifications.updateNotificationChannel", a)));

  server.tool("easypanel_send_test_notification", "Send a test notification", {
    channelId: z.string(),
  }, async (a) => ok(await client.mutation("notifications.sendTestNotification", a)));

  // === USERS ===
  server.tool("easypanel_list_users", "List all users", {}, async () =>
    ok(await client.query("users.listUsers")));

  server.tool("easypanel_create_user", "Create a user", {
    email: z.string(), password: z.string(),
  }, async (a) => ok(await client.mutation("users.createUser", a)));

  server.tool("easypanel_destroy_user", "Destroy a user", {
    userId: z.string(),
  }, async (a) => ok(await client.mutation("users.destroyUser", a)));

  server.tool("easypanel_update_user", "Update a user", {
    userId: z.string(), email: z.string().optional(), password: z.string().optional(),
  }, async (a) => ok(await client.mutation("users.updateUser", a)));

  server.tool("easypanel_generate_api_token", "Generate API token for a user", {
    userId: z.string().optional(),
  }, async (a) => ok(await client.mutation("users.generateApiToken", a)));

  server.tool("easypanel_revoke_api_token", "Revoke API token for a user", {
    userId: z.string().optional(),
  }, async (a) => ok(await client.mutation("users.revokeApiToken", a)));

  // === COMMON ===
  server.tool("easypanel_get_notes", "Get notes for a service", {
    projectName: z.string(), serviceName: z.string(),
  }, async (a) => ok(await client.query("common.getNotes", a)));

  server.tool("easypanel_set_notes", "Set notes for a service", {
    projectName: z.string(), serviceName: z.string(), notes: z.string(),
  }, async (a) => ok(await client.mutation("common.setNotes", a)));

  server.tool("easypanel_get_service_error", "Get service error", {
    projectName: z.string(), serviceName: z.string(),
  }, async (a) => ok(await client.query("common.getServiceError", a)));

  server.tool("easypanel_list_services", "List services in a project", {
    projectName: z.string(),
  }, async (a) => ok(await client.query("common.list", a)));

  server.tool("easypanel_list_service_options", "List service options", {
    projectName: z.string().optional(),
  }, async (a) => ok(await client.query("common.listOptions", a)));

  server.tool("easypanel_rename_service", "Rename a service", {
    projectName: z.string(), serviceName: z.string(), newName: z.string(),
  }, async (a) => ok(await client.mutation("common.rename", a)));
}
