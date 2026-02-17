import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ok } from "./helpers.js";

export function registerCloudflareTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_cf_get_config", "Get Cloudflare tunnel config", {}, async () =>
    ok(await client.query("cloudflareTunnel.getConfig")));

  server.tool("easypanel_cf_set_config", "Set Cloudflare tunnel config", {
    token: z.string().optional(),
  }, async (a) => ok(await client.mutation("cloudflareTunnel.setConfig", a)));

  server.tool("easypanel_cf_list_accounts", "List Cloudflare accounts", {}, async () =>
    ok(await client.query("cloudflareTunnel.listAccounts")));

  server.tool("easypanel_cf_list_tunnels", "List Cloudflare tunnels", {
    accountId: z.string().optional(),
  }, async (a) => ok(await client.query("cloudflareTunnel.listTunnels", a)));

  server.tool("easypanel_cf_list_zones", "List Cloudflare zones", {
    accountId: z.string().optional(),
  }, async (a) => ok(await client.query("cloudflareTunnel.listZones", a)));

  server.tool("easypanel_cf_get_tunnel_rules", "Get Cloudflare tunnel rules", {}, async () =>
    ok(await client.query("cloudflareTunnel.getTunnelRules")));

  server.tool("easypanel_cf_create_tunnel_rule", "Create Cloudflare tunnel rule", {
    hostname: z.string().optional(), service: z.string().optional(),
  }, async (a) => ok(await client.mutation("cloudflareTunnel.createTunnelRule", a)));

  server.tool("easypanel_cf_update_tunnel_rule", "Update Cloudflare tunnel rule", {
    ruleId: z.string().optional(), hostname: z.string().optional(), service: z.string().optional(),
  }, async (a) => ok(await client.mutation("cloudflareTunnel.updateTunnelRule", a)));

  server.tool("easypanel_cf_delete_tunnel_rule", "Delete Cloudflare tunnel rule", {
    ruleId: z.string().optional(),
  }, async (a) => ok(await client.mutation("cloudflareTunnel.deleteTunnelRule", a)));

  server.tool("easypanel_cf_start_tunnel", "Start Cloudflare tunnel", {}, async () =>
    ok(await client.mutation("cloudflareTunnel.startTunnel", {})));

  server.tool("easypanel_cf_stop_tunnel", "Stop Cloudflare tunnel", {}, async () =>
    ok(await client.mutation("cloudflareTunnel.stopTunnel", {})));
}
