import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerDomainTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_list_domains", "List domains for a service", ps, async (a) =>
    ok(await client.query("domains.listDomains", a)));

  server.tool("easypanel_create_domain", "Create a domain", {
    ...ps, host: z.string(), https: z.boolean().optional(), port: z.number().optional(), path: z.string().optional(),
  }, async (a) => ok(await client.mutation("domains.createDomain", a)));

  server.tool("easypanel_delete_domain", "Delete a domain", {
    ...ps, host: z.string(),
  }, async (a) => ok(await client.mutation("domains.deleteDomain", a)));

  server.tool("easypanel_update_domain", "Update a domain", {
    ...ps, host: z.string(), https: z.boolean().optional(), port: z.number().optional(), path: z.string().optional(),
  }, async (a) => ok(await client.mutation("domains.updateDomain", a)));

  server.tool("easypanel_get_primary_domain", "Get primary domain for a service", ps, async (a) =>
    ok(await client.query("domains.getPrimaryDomain", a)));

  server.tool("easypanel_set_primary_domain", "Set primary domain for a service", {
    ...ps, host: z.string(),
  }, async (a) => ok(await client.mutation("domains.setPrimaryDomain", a)));
}
