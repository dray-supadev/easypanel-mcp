import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ok } from "./helpers.js";

export function registerBrandingTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_branding_get_basic", "Get branding basic settings", {}, async () =>
    ok(await client.query("branding.getBasicSettings")));

  server.tool("easypanel_branding_set_basic", "Set branding basic settings", {}, async () =>
    ok(await client.mutation("branding.setBasicSettings", {})));

  server.tool("easypanel_branding_get_logo", "Get branding logo settings", {}, async () =>
    ok(await client.query("branding.getLogoSettings")));

  server.tool("easypanel_branding_set_logo", "Set branding logo settings", {}, async () =>
    ok(await client.mutation("branding.setLogoSettings", {})));

  server.tool("easypanel_branding_get_links", "Get branding links settings", {}, async () =>
    ok(await client.query("branding.getLinksSettings")));

  server.tool("easypanel_branding_set_links", "Set branding links settings", {}, async () =>
    ok(await client.mutation("branding.setLinksSettings", {})));

  server.tool("easypanel_branding_get_custom_code", "Get branding custom code", {}, async () =>
    ok(await client.query("branding.getCustomCodeSettings")));

  server.tool("easypanel_branding_set_custom_code", "Set branding custom code", {}, async () =>
    ok(await client.mutation("branding.setCustomCodeSettings", {})));

  server.tool("easypanel_branding_get_error_page", "Get branding error page settings", {}, async () =>
    ok(await client.query("branding.getErrorPageSettings")));

  server.tool("easypanel_branding_set_error_page", "Set branding error page settings", {}, async () =>
    ok(await client.mutation("branding.setErrorPageSettings", {})));

  server.tool("easypanel_branding_get_interface_public", "Get public interface settings", {}, async () =>
    ok(await client.query("branding.getInterfaceSettingsPublic")));

  server.tool("easypanel_branding_get_other_links", "Get other links settings", {}, async () =>
    ok(await client.query("branding.getOtherLinksSettings")));
}
