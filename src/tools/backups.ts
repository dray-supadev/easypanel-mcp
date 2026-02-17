import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerBackupTools(server: McpServer, client: EasyPanelClient) {
  // === DATABASE BACKUPS ===
  server.tool("easypanel_list_database_backups", "List database backups", ps, async (a) =>
    ok(await client.query("databaseBackups.listDatabaseBackups", a)));

  server.tool("easypanel_get_service_databases", "Get databases for a service", ps, async (a) =>
    ok(await client.query("databaseBackups.getServiceDatabases", a)));

  server.tool("easypanel_create_database_backup", "Create a database backup config", {
    ...ps, database: z.string().optional(), schedule: z.string().optional(), destination: z.string().optional(),
  }, async (a) => ok(await client.mutation("databaseBackups.createDatabaseBackup", a)));

  server.tool("easypanel_delete_database_backup", "Delete a database backup config", {
    ...ps, backupId: z.string().optional(),
  }, async (a) => ok(await client.mutation("databaseBackups.deleteDatabaseBackup", a)));

  server.tool("easypanel_run_database_backup", "Run a database backup now", {
    ...ps, backupId: z.string().optional(),
  }, async (a) => ok(await client.mutation("databaseBackups.runDatabaseBackup", a)));

  server.tool("easypanel_restore_database_backup", "Restore a database backup", {
    ...ps, backupId: z.string().optional(), file: z.string().optional(),
  }, async (a) => ok(await client.mutation("databaseBackups.restoreDatabaseBackup", a)));

  server.tool("easypanel_update_database_backup", "Update a database backup config", {
    ...ps, backupId: z.string().optional(), schedule: z.string().optional(), destination: z.string().optional(),
  }, async (a) => ok(await client.mutation("databaseBackups.updateDatabaseBackup", a)));

  // === VOLUME BACKUPS ===
  server.tool("easypanel_list_volume_backups", "List volume backups", ps, async (a) =>
    ok(await client.query("volumeBackups.listVolumeBackups", a)));

  server.tool("easypanel_list_volume_mounts", "List volume mounts", ps, async (a) =>
    ok(await client.query("volumeBackups.listVolumeMounts", a)));

  server.tool("easypanel_create_volume_backup", "Create a volume backup config", {
    ...ps, schedule: z.string().optional(), destination: z.string().optional(),
  }, async (a) => ok(await client.mutation("volumeBackups.createVolumeBackup", a)));

  server.tool("easypanel_destroy_volume_backup", "Destroy a volume backup config", {
    ...ps, backupId: z.string().optional(),
  }, async (a) => ok(await client.mutation("volumeBackups.destroyVolumeBackup", a)));

  server.tool("easypanel_run_volume_backup", "Run a volume backup now", {
    ...ps, backupId: z.string().optional(),
  }, async (a) => ok(await client.mutation("volumeBackups.runVolumeBackup", a)));

  server.tool("easypanel_update_volume_backup", "Update a volume backup config", {
    ...ps, backupId: z.string().optional(), schedule: z.string().optional(), destination: z.string().optional(),
  }, async (a) => ok(await client.mutation("volumeBackups.updateVolumeBackup", a)));
}
