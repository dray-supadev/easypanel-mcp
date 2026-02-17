import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ok } from "./helpers.js";

export function registerAuthTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_login", "Login to EasyPanel and get auth token", {
    email: z.string(), password: z.string(),
  }, async ({ email, password }) => {
    const token = await client.login(email, password);
    return ok(`Logged in. Token: ${token}`);
  });

  server.tool("easypanel_logout", "Logout from EasyPanel", {}, async () => {
    return ok(await client.mutation("auth.logout", {}));
  });

  server.tool("easypanel_get_session", "Get current session info", {}, async () => {
    return ok(await client.query("auth.getSession"));
  });

  server.tool("easypanel_get_user", "Get current user info", {}, async () => {
    return ok(await client.query("auth.getUser"));
  });
}
