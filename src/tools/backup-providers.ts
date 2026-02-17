import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ok } from "./helpers.js";

export function registerBackupProviderTools(server: McpServer, client: EasyPanelClient) {
  for (const provider of ["dropbox", "google", "ftp", "sftp", "local"] as const) {
    server.tool(`easypanel_${provider}_create_provider`, `Create ${provider} backup provider`, {
      name: z.string().optional(),
    }, async (a) => ok(await client.mutation(`${provider}.createProvider`, a)));

    server.tool(`easypanel_${provider}_delete_provider`, `Delete ${provider} backup provider`, {
      providerId: z.string().optional(),
    }, async (a) => ok(await client.mutation(`${provider}.deleteProvider`, a)));

    server.tool(`easypanel_${provider}_update_provider`, `Update ${provider} backup provider`, {
      providerId: z.string().optional(),
    }, async (a) => ok(await client.mutation(`${provider}.updateProvider`, a)));

    // dropbox and google have disconnect
    if (provider === "dropbox" || provider === "google") {
      server.tool(`easypanel_${provider}_disconnect_provider`, `Disconnect ${provider} backup provider`, {
        providerId: z.string().optional(),
      }, async (a) => ok(await client.mutation(`${provider}.disconnectProvider`, a)));
    }
  }
}
